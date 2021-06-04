module.exports = {

    cleanBoolean(data, optional){
        if(optional && (data === undefined || data === null)) return data;

        if(data === true || data === 1) return true;
        if(data === false || data === 0) return false;
        throw new Error("Invalid data property");
    },

    cleanNumeric(data, optional){
        if(optional && (data === undefined || data === null)) return data;

        data = data.toString();
        data = data.replace(/[^0-9-]/g, '');
        let negative = data.charAt(0) === '-';
        data = data.replace(/-/g, '');
        data = (negative) ? -data : data;
        return parseInt(data);
    },

    cleanDecimal(data, optional){
        if(optional && (data === undefined || data === null)) return data;

        try{
    		return parseFloat(data);
    	}catch(e){
    		return null;
    	}
    },

    cleanAlpha(data, optional){
        if(optional && (data === undefined || data === null)) return data;

        data = data.toString();
        data = data.replace(/[^a-zA-Z]/g, '');
        return data;
    },

    cleanAlphaNumeric(data, optional){
        if(optional && (data === undefined || data === null)) return data;

        data = data.toString();
        data = data.replace(/[^a-zA-Z0-9]/g, '');
        return data;
    },

    cleanSymbols(data, optional){
        if(optional && (data === undefined || data === null)) return data;

        if(data === null) return null;
        data = data.toString();
        data = data.replace(/[^a-zA-Z0-9 \/:._,~\-!?@#\$%\^&\*]+/g, '');
        return data;
    },

    cleanExtraSymbols(data, optional){
        if(optional && (data === undefined || data === null)) return data;

        if(data === null) return null;
        data = data.toString();
        data = data.replace(/[^a-zA-Z0-9 \"\'\n\\\/{}[\]\(\):.,_~\-!@\+=#\$%\^&\*áàâãªäÁÀÂÃÄÍÌÎÏíìîïéèêëÉÈÊËóòôõºöÓÒÔÕÖúùûüÚÙÛÜçÇñÑ]+/g, '')
        return data;
    },

    cleanPermalink(data, optional){
        if(optional && (data === undefined || data === null)) return data;

        data = data.toString();
        data = data.replace(/ & /g, ' and ');
        data = data.replace(/[^a-zA-Z0-9\- ]/g, '');
        data = data.trim();
        data = data.replace(/ {2,}/g, ' ');
        data = data.replace(/ /g, '-');
        data = data.replace(/-{2,}/g, '-');
        data = data.toLowerCase();
        return data;
    },

    cleanUUID(uuid, optional){
        if(optional && (uuid === undefined || uuid === null)) return uuid;

        if(uuid === undefined || !uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)){
            throw new Error("Invalid UUID");
        }
        return uuid;
    }

};