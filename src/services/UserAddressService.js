const { Service } = require('sonorpc');

class UserAddressService extends Service {
    async listUserAddress(accountId) {
        const rows = await this.app.mysql.query(`select
            id,
            isDefaultAddress,
            receiver,
            phoneCountryCode,
            phoneNo,
            provinceCode,
            cityCode,
            districtCode,
            detail,
            tag,
            latitude,
            longitude 
        from userAddress where accountId=@p0 order by isDefaultAddress desc`, [accountId]);

        if (rows && rows.length) {
            const areaListRes = await this.app.baseRPC.invoke('address.listAreaInfoByDistrictCodes', [rows.map(row => row.districtCode)]);
            if (!areaListRes.success) {
                return areaListRes;
            }

            rows.forEach((row) => {
                const area = areaListRes.data.find((item) => item.districtCode == row.districtCode);
                row.provinceName = area.provinceName;
                row.cityName = area.provinceName;
                row.districtName = area.districtName;
            });
        }

        return { success: true, code: 0, data: rows };
    }

    async getUserAddressById(addressId, accountId) {
        const rows = await this.app.mysql.query(`select
            id,
            isDefaultAddress,
            receiver,
            phoneCountryCode,
            phoneNo,
            provinceCode,
            cityCode,
            districtCode,
            detail,
            tag,
            latitude,
            longitude 
        from userAddress where id=@p0 and accountId=@p1`, [addressId, accountId]);

        if (rows && rows.length) {
            const data = rows[0];
            const areaListRes = await this.app.baseRPC.invoke('address.getAreaInfoByDistrictCode', [data.districtCode]);
            if (!areaListRes.success) {
                return areaListRes;
            }

            const area = areaListRes.data;
            data.provinceName = area.provinceName;
            data.cityName = area.cityName;
            data.districtName = area.districtName;

            return { success: true, code: 0, data };
        } else {
            return { success: true, code: 0, data: null };
        }
    }

    async getDefaultAddress(accountId) {
        const rows = await this.app.mysql.query(`select
            id,
            isDefaultAddress,
            receiver,
            phoneCountryCode,
            phoneNo,
            provinceCode,
            cityCode,
            districtCode,
            detail,
            tag,
            latitude,
            longitude 
        from userAddress where accountId=@p0 order by isDefaultAddress desc limit 1`, [accountId]);

        if (rows && rows.length) {
            const data = rows[0];
            const areaListRes = await this.app.baseRPC.invoke('address.getAreaInfoByDistrictCode', [data.districtCode]);
            if (!areaListRes.success) {
                return areaListRes;
            }

            const area = areaListRes.data;
            data.provinceName = area.provinceName;
            data.cityName = area.cityName;
            data.districtName = area.districtName;

            return { success: true, code: 0, data };
        } else {
            return { success: true, code: 0, data: null };
        }
    }

    async addUserAddress({
        accountId,
        isDefaultAddress,
        receiver,
        phoneCountryCode,
        phoneNo,
        provinceCode,
        cityCode,
        districtCode,
        detail,
        tag,
        latitude,
        longitude
    }) {
        if (isDefaultAddress) {
            await this.app.mysql.update('userAddress', {
                isDefaultAddress: 0
            }, { accountId });
        }

        const res = await this.app.mysql.insert('userAddress', {
            accountId,
            isDefaultAddress: isDefaultAddress ? 1 : 0,
            receiver,
            phoneCountryCode,
            phoneNo,
            provinceCode,
            cityCode,
            districtCode,
            detail,
            tag,
            latitude,
            longitude
        });
        return { success: true, code: 0, addressId: res.insertId };
    }

    async updateUserAddress({
        id,
        accountId,
        isDefaultAddress,
        receiver,
        phoneCountryCode,
        phoneNo,
        provinceCode,
        cityCode,
        districtCode,
        detail,
        tag,
        latitude,
        longitude
    }) {
        if (isDefaultAddress) {
            await this.app.mysql.update('userAddress', {
                isDefaultAddress: 0
            }, { accountId });
        }

        const res = await this.app.mysql.update('userAddress', {
            isDefaultAddress: isDefaultAddress ? 1 : 0,
            receiver,
            phoneCountryCode,
            phoneNo,
            provinceCode,
            cityCode,
            districtCode,
            detail,
            tag,
            latitude,
            longitude
        }, { id, accountId });

        return { success: true, code: 0, data: res };
    }
}

module.exports = UserAddressService;