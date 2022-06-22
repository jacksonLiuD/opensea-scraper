const OpenseaScraper = require("./src/index.js");
const shell = require('shelljs');
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const fs = require("fs");
// Set the region
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: "rnAJYiPpYu/x+sMeYBNQGuNjLvoZ/z6R/Jn4tjSz",
    secretAccessKey: "AKIAZ3YPQZG7XQLKHUR3"
});

// Create DynamoDB service object
var ddb = new AWS.DynamoDB();
const demoRankings = true;

// which NFT project to scrape?
var slugs;
var basicInfos = [];
const options = {
    debug: false, sort: true, logs: true, browserInstance: undefined,
}
// console.log(`===>>> ${slug} <<<===`);
// console.log("OPTIONS:");
console.log(options);

(async () => {

    // scrape rankings => https://opensea.io/rankings?sortBy=total_volume
    if (demoRankings) {
        const chain = "ethereum";
        const rankings = await OpenseaScraper.rankings("total", options, chain);
        slugs = rankings.map(o => o.slug);
        // console.log(slugs);
    }


    // basic info
    for (const slug of slugs) {
        const basicInfo = await OpenseaScraper.basicInfo(slug, Date.now());
        basicInfos.push(basicInfo)
    }
    var groups = group(basicInfos, 25);

    for (const group of groups) {
        var params = {
            "nft_floor_price": group
        }
        // ddb.batchWriteItem(params, function (err, data) {
        //     if (err) {
        //         console.log("Error", err);
        //     } else {
        //         console.log("Success", data);
        //     }
        // });
        // convert JSON object to string
        const data = JSON.stringify(params);
        // shell.exec('ls')
        // write JSON string to a file
        try {
            fs.writeFileSync('nft_price.json', data);
            console.log("JSON data is saved.");
        } catch (error) {
            console.error(error);
        }
        shell.exec('aws dynamodb batch-write-item --request-items file://nft_price.json')


    }

    // console.log(`\n\n\n\n✅ === OpenseaScraper.basicInfo(slug) ===`);
    // const basicInfo = await OpenseaScraper.basicInfo(slug);
    // console.log(`basic info (taken from the opensea API):`);
    // console.log(basicInfo);
    // }
})();

function group(array, subGroupLength) {
    var index = 0;
    var newArray = [];

    while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }

    return newArray;
}




