const os = require('os');

/**
 * 获取当前机器的ip地址
 */
function getIpAddress() {
    var ifaces = os.networkInterfaces()

    for (var dev in ifaces) {
        let iface = ifaces[dev]

        for (let i = 0; i < iface.length; i++) {
            let { family, address, internal } = iface[i]
            // console.log(iface);
            if (family === 'IPv4' && address !== '127.0.0.1' && !internal && address != '8.8.8.61') {
                return address
            }
        }
    }
}

// let ipAddress = getIpAddress();
// console.log(ipAddress);

module.exports = {
    getIpAddress: getIpAddress,
} 