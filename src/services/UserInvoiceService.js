const { Service } = require('sonorpc');

class UserInvoiceService extends Service {
    async listInvoice(accountId) {
        const rows = await this.app.mysql.query(`select
            id,
            isDefault,
            type,
            titleType,
            title,
            taxCode,
            phoneNo
        from userInvoice where accountId=@p0  order by isDefault desc,updateDt desc`, [accountId]);

        return { success: true, code: 0, data: rows };
    }

    async getDefaultInvoice(accountId) {
        const rows = await this.app.mysql.query(`select
            id,
            isDefault,
            type,
            titleType,
            title,
            taxCode,
            phoneNo
        from userInvoice where accountId=@p0 order by isDefault desc,updateDt desc limit 1`, [accountId]);

        return { success: true, code: 0, data: rows[0] || null };
    }

    async addInvoice({
        accountId,
        isDefault,
        type,
        titleType,
        title,
        taxCode,
        phoneNo
    }) {
        const rows = await this.app.mysql.query('select id from userInvoice where title=@p0 and accountId=@p1', [title, accountId]);
        if (rows && rows.length) {
            return await this.updateInvoice({
                id: rows[0].id,
                accountId,
                isDefault,
                type,
                titleType,
                title,
                taxCode,
                phoneNo
            });
        } else {
            if (isDefault) {
                await this.app.mysql.update('userInvoice', {
                    isDefault: 0
                }, { accountId });
            }

            const res = await this.app.mysql.insert('userInvoice', {
                accountId,
                isDefault: isDefault ? 1 : 0,
                type,
                titleType,
                title,
                taxCode: titleType == 2 ? taxCode : null,
                phoneNo: type == 2 ? phoneNo : null,
                updateDt: new Date()
            });
            return { success: true, code: 0, addressId: res.insertId };
        }
    }

    async updateInvoice({
        id,
        accountId,
        isDefault,
        type,
        titleType,
        title,
        taxCode,
        phoneNo
    }) {
        if (isDefault) {
            await this.app.mysql.update('userInvoice', {
                isDefault: 0
            }, { accountId });
        }

        const res = await this.app.mysql.update('userInvoice', {
            isDefault: isDefault ? 1 : 0,
            type,
            titleType,
            title,
            taxCode: titleType == 2 ? taxCode : null,
            phoneNo: type == 2 ? phoneNo : null,
            updateDt: new Date()
        }, { id, accountId });

        return { success: true, code: 0, data: res };
    }
}

module.exports = UserInvoiceService;