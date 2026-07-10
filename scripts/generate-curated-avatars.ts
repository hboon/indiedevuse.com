import { $ } from "bun";
import { access, mkdir, rm } from "node:fs/promises";
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
  "kilian-valkhof": {
    kind: "bluesky",
    actor: "kilianvalkhof.com",
    label: "Bluesky profile photo",
  },
  "thibault-louis-lucas": {
    kind: "bluesky",
    actor: "tmaker.io",
    label: "Bluesky profile photo",
  },
  "marc-lou": {
    kind: "direct",
    url: "https://unavatar.io/x/marclou",
    label: "X profile photo",
  },
  "pieter-levels": {
    kind: "direct",
    url: "https://unavatar.io/x/levelsio",
    label: "X profile photo",
  },
  "ben-robertson": {
    kind: "direct",
    url: "https://unavatar.io/x/benrobertsonio",
    label: "X profile photo",
  },
  "arvid-kahl": {
    kind: "direct",
    url: "https://github.com/arvidkahl.png?size=512",
    label: "GitHub profile photo",
  },
  "joe-masilotti": {
    kind: "direct",
    url: "https://github.com/joemasilotti.png?size=512",
    label: "GitHub profile photo",
  },
  "josh-pigford": {
    kind: "direct",
    url: "https://github.com/shpigford.png?size=512",
    label: "GitHub profile photo",
  },
  "christoph-miksche": {
    kind: "direct",
    url: "https://github.com/cmiksche.png?size=512",
    label: "GitHub profile photo",
  },
  "jared-rigby": {
    kind: "direct",
    url: "https://github.com/jazibobs.png?size=512",
    label: "GitHub profile photo",
  },
  "zilvinas-kucinskas": {
    kind: "direct",
    url: "https://github.com/ZilvinasKucinskas.png?size=512",
    label: "GitHub profile photo",
  },
  "jakob-greenfeld": {
    kind: "direct",
    url: "https://unavatar.io/x/jakobgreenfeld",
    label: "X profile photo",
  },
  "jon-yongfook": {
    kind: "direct",
    url: "https://github.com/yongfook.png?size=512",
    label: "GitHub profile photo",
  },
  "damon-chen": {
    kind: "direct",
    url: "https://unavatar.io/x/damengchen",
    label: "X profile photo",
  },
  "andrew-culver": {
    kind: "direct",
    url: "https://storage.ghost.io/c/10/df/10df4670-d02d-4e74-afa1-81bc2319794c/content/images/2018/05/iniQmnYi_400x400.jpg",
    label: "Bullet Train author photo",
  },
  "tony-dinh": {
    kind: "direct",
    url: "https://unavatar.io/x/tdinh_me",
    label: "X profile photo",
  },
  "daniel-nguyen": {
    kind: "bluesky",
    actor: "danielnguyen.me",
    label: "Bluesky profile photo",
  },
  "dmytro-krasun": {
    kind: "direct",
    url: "https://github.com/krasun.png?size=512",
    label: "GitHub profile photo",
  },
  "mouad-ennaciri": {
    kind: "direct",
    url: "https://github.com/mouadennaciri.png?size=512",
    label: "GitHub profile photo",
  },
  "tom-dallimore": {
    kind: "direct",
    url: "https://unavatar.io/x/tom_dallimore",
    label: "X profile photo",
  },
  "rodrigo-rocco": {
    kind: "direct",
    url: "https://unavatar.io/x/rrmdp",
    label: "X profile photo",
  },
  "uwe-dreissigacker": {
    kind: "direct",
    url: "https://unavatar.io/x/uwedreiss",
    label: "X profile photo",
  },
  "anton-medviediev": {
    kind: "direct",
    url: "https://unavatar.io/x/AMedviediev",
    label: "X profile photo",
  },
  "andris-reinman": {
    kind: "direct",
    url: "https://github.com/andris9.png?size=512",
    label: "GitHub profile photo",
  },
  "harvey-carpenter": {
    kind: "direct",
    url: "https://appsumo2-cdn.appsumo.com/media/users/avatars/1621861044461.jpeg?width=150",
    label: "AppSumo founder photo",
  },
  "valerian-de-thezan-de-gaussan": {
    kind: "direct",
    url: "https://avatars.githubusercontent.com/u/23501802?v=4",
    label: "GitHub profile photo",
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
  const avatarSource = `${source.label}: ${sourceURL}`;
  if (
    developer.avatar === avatarPath &&
    developer.provenance.avatarSource === avatarSource &&
    (await fileExists(outputURL))
  ) {
    continue;
  }
  await writeOptimizedAvatar(sourceURL, outputURL);
  developer.avatar = avatarPath;
  developer.provenance.avatarSource = avatarSource;
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
  if (await commandExists("jpegoptim")) {
    await $`jpegoptim --strip-all ${outputPath}`.quiet();
  }
}

async function commandExists(command: string) {
  const result = await $`command -v ${command}`.quiet().nothrow();
  return result.exitCode === 0;
}

async function fileExists(fileURL: URL) {
  try {
    await access(fileURL);
    return true;
  } catch {
    return false;
  }
}
