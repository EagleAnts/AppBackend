const rp = require("request-promise");

// newNodeUrl 

function registerAndBroadcastNode(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (Users.networkNodes.indexOf(newNodeUrl) == -1)
    Users.networkNodes.push(newNodeUrl);
  const regNodePromises = [];
  console.log(Users.networkNodes);
  Users.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl },
      json: true,
    };

    regNodePromises.push(rp(requestOptions));
  });
  Promise.all(regNodePromises)
    .then((data) => {
      const requestBulkOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...Users.networkNodes, Users.currentNodeURL],
        },
        json: true,
      };
      return rp(requestBulkOptions);
    })
    .then((data) => {
      res.json({ note: "New Node Registered Successfully with the Network" });
    });
};


// function registerNode(req, res) {
//   const newNodeUrl = req.body.newNodeUrl;
//   if (
//     Users.networkNodes.indexOf(newNodeUrl) == -1 &&
//     Users.currentNodeURL !== newNodeUrl
//   ) {
//     Users.networkNodes.push(newNodeUrl);
//   }
//   res.json({ note: "New Node Registered Successfully" });
// };

// function registerNodesBulk(req, res) {
//   const allNetworkNodes = req.body.allNetworkNodes;
//   allNetworkNodes.forEach((newNodeUrl) => {
//     if (
//       Users.networkNodes.indexOf(newNodeUrl) == -1 &&
//       Users.currentNodeURL !== newNodeUrl
//     ) {
//       Users.networkNodes.push(newNodeUrl);
//     }
//   });
//   res.json({ note: "Bulk Registered Successfully" });
// };