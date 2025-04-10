import moment from 'moment'

export default {
    date (value, format) {
        return moment(value).format(format)
    },
    message (created_at) {
        let day = moment().format('YYYY-MM-DD')
        let date = moment(created_at).format('YYYY-MM-DD')
        if(day == date) return moment(created_at).startOf('day').fromNow()
        return moment(created_at).format('hh:mm:ss a DD/MM/YYYY')
    },
    decimal(val, decimal) {
        val = parseFloat(val ?? 0)
        return val.toFixed(decimal)
    },
    round(val) {
        return Math.round(val)
    },
    fNumber(value) {
        const numero = parseFloat(value)
        if (isNaN(numero)) {
            return value
        }
        if (numero >= 1000000) {
            return (numero / 1000000).toFixed(2) + 'M'
        }
        return numero.toLocaleString()
    },
}