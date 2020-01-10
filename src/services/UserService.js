const { Service } = require('sonorpc');

const { PARAM_ERROR } = require('../constants/error');

class UserService extends Service {
    async getUserInfo(accountId) {
        if (typeof accountId !== 'number') {
            return PARAM_ERROR;
        }
        const rows = await this.app.mysql.query('select accountId,userName,nickName,avatars,email,birthday,gender,extInfo from userInfo where accountId=@p0', [accountId]);
        if (!rows || !rows.length) {
            const user = {
                accountId,
                userName: '新用户' + accountId
            };
            await this.app.mysql.insert('userInfo', user);
            return { success: true, code: 0, data: user };
        }
        return { success: true, code: 0, data: rows[0] };
    }
}

module.exports = UserService;