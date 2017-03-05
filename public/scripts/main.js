(function () {
    function buildOutletSwitches(outlets) {
        var outletSwitchContainer = document.createElement('div');
        outlets.forEach(function (outlet, i) {
            var outletSwitch = createOutletSwitch(outlet);
            outletSwitch.querySelector('input').onclick = function (event) {
                event.preventDefault();
            };
            // outletSwitch.querySelector('.slider').onclick = function () {
            //     Request.getJSON('/api/toggle/' + i, function (newOutlet) {
            //         setOutletSwitchState(newOutlet, outletSwitch);
            //     });
            // };
            outletSwitchContainer.appendChild(outletSwitch);
        });
        return outletSwitchContainer;
    }

    function createOutletSwitch(outlet) {
        var label = document.createElement('label');
        var span = document.createElement('span');
        var input = document.createElement('input');
        var div = document.createElement('div');
        label.className = 'switch';
        input.type = 'checkbox';
        div.className = 'slider round';
        label.appendChild(span)
        label.appendChild(input)
        label.appendChild(div);
        if (outlet) {
            setOutletSwitchState(outlet, label);
        }
        return label;
    }

    function setOutletSwitchState(outlet, outletSwitch) {
        outletSwitch.querySelector('input').checked = outlet.isOn;
        outletSwitch.querySelector('span').innerHTML = generateOutletStateString(outlet);
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