/* Archivo que contiene el formato de fechas */
var monthNames = ["ene.", "feb.", "mar.", "abri.", "may.", "jun.",
    "jul.", "ago.", "sep.", "oct.", "nov.", "dec."
];

export function formattedDate(d) {
    try {
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        const year = String(d.getFullYear());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return `${year}-${month}-${day}`;

    } catch (e) {
        console.log(e);
    }

}

export function formattedDateAndHour(d) {
    try {
        if (d) {
            let month = String(d.getMonth() + 1);
            let day = String(d.getDate());
            const year = String(d.getFullYear());

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            var h = addZero(d.getHours());
            var m = addZero(d.getMinutes());
            return `${year}-${month}-${day} ${h}:${m}`;
        }

    } catch (e) {
        console.log(e)
    }
}

export function formattedHour(d) {
    try {
        var h = addZero(d.getHours());
        var m = addZero(d.getMinutes());
        return `${h}:${m}`;

    } catch (e) {
        console.log(e)
    }
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

export function formattedStringtoDate(s) {
    debugger
    if (s) {
        var d = Date.parse(s);
        d = new Date(d);
        return d;
    } else {
        return null;
    }

}

export function formattedDateStringtoDate(s) {
    debugger
    if (s) {
        var d = new Date(s);
        return d;
    } else {
        return null;
    }

}

export function getDatenow() {
    var d = formattedDate(new Date());

    return d;
}

export function getHourFromDate(date) {
    try {
        var h = addZero(date.getHours());
        var m = addZero(date.getMinutes());
        return (h + ':' + m);
    } catch (e) {
        console.log(e);
    }
}

export function getDateWithNameMonth(date) {
    try {
        var d = new Date();
        var dia = addZero(date.getDate());
        var mes = addZero(date.getMonth() + 1);
        if (date.getFullYear() == d.getFullYear()) {
            return (date.getDate() + ' ' + monthNames[date.getMonth() + 1]);
        } else {
            return (dia + '/' + mes + '/' + date.getFullYear());
        }

    } catch (e) {
        console.log(e);
    }

}