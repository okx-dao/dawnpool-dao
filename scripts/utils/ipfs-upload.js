const { create } = require('ipfs-http-client');

async function uploadToIPFS(val) {
    const ipfsClient = await create({ url: "http://127.0.0.1:5001/api/v0" });
    const result = await ipfsClient.add(JSON.stringify(val));
    // console.log("ipfs://" + result.cid);
    return "ipfs://" + result.cid;
}

module.exports = {
    uploadToIPFS
}
