(function () {
    function buildOutletSwitches(outlets) {
        var outletSwitchContainer = document.createElement('div');
        outlets.forEach(function (outlet) {
            var outletSwitch = createOutletSwitch(outlet);
            addOutletSwitchHandlers(outlet, outletSwitch);
            outletSwitchContainer.appendChild(outletSwitch);
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
        var input = outletSwitch.querySelector('input');
        var slider = outletSwitch.querySelector('.slider');
        outletSwitch.components.input.onclick = function (event) {
            event.preventDefault();
        };
        outletSwitch.components.slider.onclick = function () {
           toggleSwitch(outletSwitch, outlet.id); 
        };
        createOutletSwitch.components.slider.onkeydown = function (event) {
            if (event.keyCode === 13) {
                toggleSwitch(outletSwitch, outlet.id);
            }
        };
    }

    function toggleSwitch(outletSwitch, id) {
        outletSwitch.components.input.disabled = true;
        Request.getJSON('/api/toggle/' + id, function (newOutlet) {
            setOutletSwitchState(newOutlet, outletSwitch);
        });
    }

    function setOutletSwitchState(outlet, outletSwitch) {
        outletSwitch.components.input.disabled = false;
        outletSwitch.components.input.checked = outlet.isOn;
        outletSwitch.components.name.innerHTML = generateOutletStateString(outlet);
    }

    function generateOutletStateString(outlet) {
        return outlet.name + ' (' + (outlet.isOn ? 'On' : 'Off')  + ')';  
    }

    // Initialize state of switch toggles in client view based off state sent from
    // server when starting up
    window.onload = function () {
        Request.getJSON('/api/state/', function (outlets) {
            var outletHTML = buildOutletSwitches(outlets);
            document.body.appendChild(outletHTML);
        });
    };
}());