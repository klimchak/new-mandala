const defaultStages = {
  Checking: "Checking For Updates!",
  Found: "Update Found!",
  NotFound: "No Update Found.",
  Downloading: "Downloading...",
  Unzipping: "Installing...",
  Cleaning: "Finalizing...",
  Launch: "Launching..."
};

const defaultOptions = {
  useGithub: true,
  gitRepo: "unknown",
  gitUsername: "unknown",
  isGitRepoPrivate: false,
  gitRepoToken: "uknown",

  appName: "unknown",
  appExecutableName: this.appName + "",

  // appDirectory: app_library + this.appName,
  versionFile: this.appDirectory + "/settings/version.json",
  tempDirectory: this.appDirectory + "/tmp",

  progressBar: null,
  label: null,
  forceUpdate: false,
  stageTitles: defaultStages
};

