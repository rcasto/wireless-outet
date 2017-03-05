var Request = (function () {
    /*
        This function was taken from: https://plainjs.com/javascript/ajax/send-ajax-get-and-post-requests-47/
    */
    function get(url, success, failure) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('GET', url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState > 3 && xhr.status === 200) {
                success && success(xhr.responseText);
            }
        };
        xhr.onerror = failure;
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();
        return xhr;
    }
    
    function getJSON(url, success, failure) {
        return get(url, function (data) {
            data = tryParseJSON(data);
            if (typeof data === "undefined") {
                failure && failure(data);
            } else {
                success && success(data); 
            }
        }, failure);
    }

    function tryParseJSON(data) {
        try {
            return JSON.parse(data);
        } catch(error) {
            return undefined;
        }
    }
    
    return {
        get: get,
        getJSON: getJSON  
    };
}());