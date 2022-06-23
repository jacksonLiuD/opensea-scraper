const axios = require("axios");
/**
 * gets basic info of a collection from the API
 * => api.opensea.io/collection/{slug}
 * no puppeteer is involved here
 */
const basicInfo = async (slug, ts) => {
    const response = await axios.get(`https://api.opensea.io/collection/${slug}`);
    const collectionObj = response.data.collection;
    const stats = _getStats(collectionObj);
    return {
        "PutRequest": {
            "Item": {
                "slug": {
                    "S": slug
                },
                "name": {
                    "S": _getName(collectionObj)
                },
                "symbol": {
                    "S": _getSymbol(collectionObj)
                },
                "timestamp": {
                    "S": Math.round(ts / 1000).toString()
                },
                "date": {
                    "S": date(ts)
                },
                "floorPrice": {
                    "S": stats ? (stats.floorPrice ? stats.floorPrice.toString() : " ") : " "
                },
                "address": {
                    "S": _getContractAddress(collectionObj)
                }
            }
        }
        // safelistRequestStatus: _getSafelistRequestStatus(collectionObj),
        // isVerified: _isVerified(collectionObj),
        // bannerImageUrl: _getBannerImageUrl(collectionObj),
        // imageUrl: _getImageUrl(collectionObj),
        // social: {
        //   discord: _getDiscord(collectionObj),
        //   medium: _getMedium(collectionObj),
        //   twitter: _getTwitter(collectionObj),
        //   website: _getWebsite(collectionObj),
        //   telegram: _getTelegram(collectionObj),
        //   instagram: _getInstagram(collectionObj),
        //   wiki: _getWiki(collectionObj),
        // },
        // createdAt: new Date(),
    };
};

function _getStats(collectionObj) {
    try {
        return _camelCase(collectionObj.stats);
    } catch (err) {
        return null;
    }
}

function _getName(collectionObj) {
    try {
        return collectionObj.name;
    } catch (err) {
        return null;
    }
}

function _getContractAddress(collectionObj) {
    try {
        return collectionObj.primary_asset_contracts[0].address;
    } catch (err) {
        return null;
    }
}

function _getBannerImageUrl(collectionObj) {
    try {
        return collectionObj.banner_image_url;
    } catch (err) {
        return null;
    }
}

function _getImageUrl(collectionObj) {
    try {
        return collectionObj.image_url;
    } catch (err) {
        return null;
    }
}

function _getDiscord(collectionObj) {
    try {
        return collectionObj.discord_url;
    } catch (err) {
        return null;
    }
}

function _getMedium(collectionObj) {
    try {
        return collectionObj.medium_username;
    } catch (err) {
        return null;
    }
}

function _getTwitter(collectionObj) {
    try {
        return collectionObj.twitter_username;
    } catch (err) {
        return null;
    }
}

function _getWebsite(collectionObj) {
    try {
        return collectionObj.external_url;
    } catch (err) {
        return null;
    }
}

function _getTelegram(collectionObj) {
    try {
        return collectionObj.telegram_url;
    } catch (err) {
        return null;
    }
}

function _getInstagram(collectionObj) {
    try {
        return collectionObj.instagram_username;
    } catch (err) {
        return null;
    }
}

function _getWiki(collectionObj) {
    try {
        return collectionObj.wiki_url;
    } catch (err) {
        return null;
    }
}

function _getDescription(collectionObj) {
    try {
        return collectionObj.description;
    } catch (err) {
        return null;
    }
}

function _getSymbol(collectionObj) {
    try {
        return collectionObj.primary_asset_contracts[0].symbol;
    } catch (err) {
        return null;
    }
}

function _getSafelistRequestStatus(collectionObj) {
    try {
        return collectionObj.safelist_request_status;
    } catch (error) {
        return null;
    }
}

function _isVerified(collectionObj) {
    try {
        const safelistRequestStatus = _getSafelistRequestStatus(collectionObj);
        return safelistRequestStatus === "verified";
    } catch (error) {
        return null;
    }
}

function _camelCase(obj) {
    let newObj = {};
    for (d in obj) {
        if (obj.hasOwnProperty(d)) {
            newObj[
                d.replace(/(\_\w)/g, function (k) {
                    return k[1].toUpperCase();
                })
                ] = obj[d];
        }
    }
    return newObj;
}

/**
 * 和PHP一样的时间戳格式化函数
 * @return {string}   格式化的时间字符串
 * @param m
 */
function add0(m) {
    return m < 10 ? '0' + m : m
}

function date(timestamp) {
    var time = new Date(timestamp);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    return y + '-' + add0(m) + '-' + add0(d);
}

module.exports = basicInfo;
