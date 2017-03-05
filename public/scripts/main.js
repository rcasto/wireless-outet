(function () {
    function buildOutletHTML(outlets) {
        var outletContainer = document.createElement('div'), outletHTML;
        outlets.forEach(function (outlet, i) {
            outletHTML = createOutletSwitch(outlet);
            outletHTML.querySelector('.slider').onclick = function () {
                Request.getJSON('/api/toggle/' + i, function (json) {
                    console.log(json);
                });
            };
            outletContainer.appendChild(outletHTML);
        });
        return outletContainer;
    }

    function createOutletSwitch(outlet) {
        var label = document.createElement('label');
        var span = document.createElement('span');
        var input = document.createElement('input');
        var div = document.createElement('div');
        label.className = 'switch';
        span.innerHTML = outlet.name;
        input.type = 'checkbox';
        input.checked = outlet.isOn;
        div.className = 'slider round';
        label.appendChild(span)
        label.appendChild(input)
        label.appendChild(div);
        return label;
    }

    // Initialize state of switch toggles in client view based off state sent from
    // server when starting up
    window.onload = function () {
        Request.getJSON('/api/state/', function (outlets) {
            var outletHTML = buildOutletHTML(outlets);
            document.body.appendChild(outletHTML);
        });
    };
}());