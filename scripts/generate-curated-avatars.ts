import { $ } from "bun";
import { mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

type Developer = {
  id: string;
  name: string;
  avatar: string;
  provenance?: {
    sourceType?: string;
    avatarSource?: string;
  };
};

type DevelopersJSON = {
  developers: Developer[];
};

type CuratedAvatarSource =
  | {
      kind: "direct";
      url: string;
      label: string;
    }
  | {
      kind: "bluesky";
      actor: string;
      label: string;
    };

const developersURL = new URL(
  "../frontend/src/data/developers.json",
  import.meta.url,
);
const avatarsURL = new URL("../frontend/public/avatars/", import.meta.url);
const developersJSON = (await Bun.file(developersURL).json()) as DevelopersJSON;
const curatedAvatarSources: Record<string, CuratedAvatarSource> = {
  "mathias-michel": {
    kind: "direct",
    url: "https://unavatar.io/x/m91michel",
    label: "X profile photo",
  },
  "jan-lavicka": {
    kind: "direct",
    url: "https://unavatar.io/x/janlavicka",
    label: "X profile photo",
  },
  "aleksey-razbakov": {
    kind: "direct",
    url: "https://unavatar.io/x/razbakov",
    label: "X profile photo",
  },
  "jouke-siekman": {
    kind: "direct",
    url: "https://github.com/siekman-io.png?size=512",
    label: "GitHub profile photo",
  },
  "rebecca-owen": {
    kind: "bluesky",
    actor: "beccais.online",
    label: "Bluesky profile photo",
  },
};

await mkdir(avatarsURL, { recursive: true });

for (const developer of developersJSON.developers) {
  if (developer.provenance?.sourceType !== "owner-curated") {
    continue;
  }
  const source = curatedAvatarSources[developer.id];
  if (!source) {
    if (developer.avatar === "/avatars/curated-placeholder.svg") {
      throw new Error(`Missing curated avatar source for ${developer.id}`);
    }
    continue;
  }

  const sourceURL = await avatarURLForSource(source);
  const avatarPath = `/avatars/${developer.id}.jpg`;
  const outputURL = new URL(`../frontend/public${avatarPath}`, import.meta.url);
  await writeOptimizedAvatar(sourceURL, outputURL);
  developer.avatar = avatarPath;
  developer.provenance.avatarSource = `${source.label}: ${sourceURL}`;
}

await Bun.write(developersURL, `${JSON.stringify(developersJSON, null, 2)}\n`);

async function avatarURLForSource(source: CuratedAvatarSource) {
  if (source.kind === "direct") {
    return source.url;
  }
  const response = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(source.actor)}`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to load Bluesky profile ${source.actor}: ${response.status}`,
    );
  }
  const profile = (await response.json()) as { avatar?: string };
  if (!profile.avatar) {
    throw new Error(`Bluesky profile ${source.actor} has no avatar`);
  }
  return profile.avatar;
}

async function writeOptimizedAvatar(sourceURL: string, outputURL: URL) {
  const temporaryURL = new URL(`${outputURL.pathname}.download`, "file://");
  const temporaryPath = fileURLToPath(temporaryURL);
  const outputPath = fileURLToPath(outputURL);
  const response = await fetch(sourceURL, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Failed to download ${sourceURL}: ${response.status}`);
  }
  await Bun.write(temporaryURL, await response.arrayBuffer());
  try {
    await $`magick ${temporaryPath} -auto-orient -resize 512x512^ -gravity center -extent 512x512 -strip -quality 86 ${outputPath}`;
  } finally {
    await rm(temporaryPath, { force: true });
  }
  await $`/Applications/ImageOptim.app/Contents/MacOS/ImageOptim ${outputPath}`.quiet();
}
