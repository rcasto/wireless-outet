(function () {
    var outletSwitchTimeouts = {};

    function buildOutletSwitches(outlets) {
        var outletSwitchContainer = document.createElement('div');
        outlets.forEach(function (outlet) {
            var outletSwitch = createOutletSwitch(outlet);
            addOutletSwitchHandlers(outlet, outletSwitch);
            outletSwitchContainer.appendChild(outletSwitch.switch);
        });
        return outletSwitchContainer;
    }

    function createOutletSwitch(outlet) {
        var label = document.createElement('label');
        var span = document.createElement('span');
        var input = document.createElement('input');
        var div = document.createElement('div'), outletSwitch;
        label.className = 'switch';
        input.type = 'checkbox';
        div.className = 'slider round';
        div.tabIndex = 0;
        label.appendChild(span)
        label.appendChild(input)
        label.appendChild(div);
        outletSwitch = {
            switch: label,
            components: { // quick access to elems inside
                input: input,
                slider: div,
                name: span
            }
        };
        if (outlet) {
            setOutletSwitchState(outlet, outletSwitch);
        }
        return outletSwitch;
    }

    function addOutletSwitchHandlers(outlet, outletSwitch) {
        outletSwitch.components.input.onclick = function (event) {
            event.preventDefault();
        };
        outletSwitch.components.slider.onclick = function () {
           toggleSwitch(outletSwitch, outlet.id); 
        };
        outletSwitch.components.slider.onkeydown = function (event) {
            if (event.keyCode === 13) {
                toggleSwitch(outletSwitch, outlet.id);
            }
        };
    }

    function toggleSwitch(outletSwitch, id) {
        window.clearTimeout(outletSwitchTimeouts[id]);
        outletSwitch.components.input.disabled = true;
        outletSwitch.components.slider.className = 'slider round';
        outletSwitchTimeouts[id] = null;
        Request.getJSON('/api/toggle/' + id, function (newOutlet) {
            setOutletSwitchState(newOutlet, outletSwitch);
            outletSwitch.components.input.disabled = false;
            outletSwitch.components.slider.className = 'slider round success-highlight';
            outletSwitchTimeouts[id] = window.setTimeout(function () {
                outletSwitch.components.slider.className = 'slider round';
            }, 2000);
        }, function () {
            outletSwitch.components.input.disabled = false;
            outletSwitch.components.slider.className = 'slider round error-highlight';
            outletSwitchTimeouts[id] = window.setTimeout(function () {
                outletSwitch.components.slider.className = 'slider round';
            }, 2000);
        });
    }

    function setOutletSwitchState(outlet, outletSwitch) {
        outletSwitch.components.input.checked = outlet.isOn;
        outletSwitch.components.name.innerHTML = generateOutletStateString(outlet);
    }

    function generateOutletStateString(outlet) {
        return outlet.name + ' (' + (outlet.isOn ? 'On' : 'Off')  + ')';  
    }

    function createErrorAlert(msg, error) {
        var msgNode = document.createTextNode('Error: ' + msg);
        var errorNode = document.createTextNode('\"' + error + '\"');
        var alertContainer = document.createElement('div');
        var msgContainer = document.createElement('div');
        var errorContainer = document.createElement('div');
        msgContainer.className = 'error-alert-message';
        msgContainer.appendChild(msgNode);
        errorContainer.appendChild(errorNode);
        alertContainer.className = 'error-alert';
        alertContainer.appendChild(msgContainer);
        alertContainer.appendChild(errorContainer);
        return alertContainer;
    }

    // Initialize state of switch toggles in client view based off state sent from
    // server when starting up
    window.onload = function () {
        Request.getJSON('/api/state/', function (outlets) {
            var outletHTML = buildOutletSwitches(outlets);
            document.body.appendChild(outletHTML);
        }, function (error) {
            var errorAlert = createErrorAlert('Failed to retrieve initial state, please refresh or check your internet connection', error);
            console.error(error);
            document.body.appendChild(errorAlert);
        });
    };
}());