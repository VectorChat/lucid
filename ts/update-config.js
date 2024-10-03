const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const configPath = path.join("/cluster-config", "service.json");

function updateConfig() {
  let config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  // Update with realistic peer IDs
  config.consensus.crdt.trusted_peers = [
    '12D3KooWMmZqkk1Ek8vonm3FE3rNMLqqxwspRiKwx5ZD5yn4tPLG',
    '12D3KooWS92ucchSQ4djSrhJdjVAnd2TVPvMAhSeveRvdDa1bHG5',
    '12D3KooWAxXgjXS2vBj5wbW8rm1uFD9s1VKbt5wqWvaHv3g9NpGy',
    '12D3KooWEUgzttDhsHR5KtQcmCUVEZJWbAiQyWjmboMSfDTegqGk',
];

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("Configuration updated successfully.");
  restartCluster();
}

function restartCluster() {
  try {
    const clusterPid = execSync(
      "ps aux | grep '/usr/local/bin/ipfs-cluster-service' | grep -v grep | awk '{print $2}'"
    )
      .toString()
      .trim();
    if (clusterPid) {
      execSync(`kill -15 ${clusterPid}`);
      console.log(
        `Cluster service (PID: ${clusterPid}) restarted successfully.`
      );
    } else {
      console.log("Cluster service process not found.");
    }
  } catch (error) {
    console.error(`Error restarting cluster: ${error.message}`);
  }
}

updateConfig();
