const si = require('systeminformation');
 
// 获取CPU当前占用率
si.currentLoad().then(data => {
    console.log('Current CPU Load:', data.currentLoad); // 这会显示一个介于0到1之间的数，表示当前CPU的负载
}).catch(error => {
    console.error('Error getting CPU load:', error);
});