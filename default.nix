with import <nixpkgs> {};

mkYarnPackage rec {
    name = "api-server";
    src = ./.;
    packageJSON = ./package.json;
    yarnLock = ./yarn.lock;
    yarnNix = ./yarn.nix;
    postBuild = ''
      NODE_ENV=production yarn run build
    '';

    meta = with pkgs.lib; {
      description = "api.doenet.cloud webservices";
      license = licenses.agpl3;
      homepage = "https://github.com/Doenet/cloud-api";
      maintainers = with maintainers; [ kisonecat ];
      platforms = platforms.linux;
    };
}
