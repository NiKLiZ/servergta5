let types = ['alert', 'error', 'success', 'information', 'warning'];
let layouts = ['top', 'topLeft', 'topCenter', 'topRight', 'center', 'centerLeft', 'centerRight', 'bottom', 'bottomLeft', 'bottomCenter', 'bottomRight'];
let colors = ['#FFFFFF','#FF0000','#61FF00','#FFE600'];
function notify(message='',type=0, layout=10,  time=1800,progressBar = false) {
    
    message = `<div class="text">
        <span>${message}</span>
        <div class="icon">
            <svg width="2" height="13" viewBox="0 0 2 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.292237 9.16451H1.81735L1.93607 0H0.164383L0.292237 9.16451ZM2 12.0548C2 11.7821 1.91781 11.5549 1.75342 11.3731C1.58295 11.1853 1.33333 11.0913 1.00457 11.0913C0.675799 11.0913 0.426179 11.1853 0.255708 11.3731C0.0852358 11.5549 0 11.7821 0 12.0548C0 12.3274 0.0852358 12.5546 0.255708 12.7364C0.426179 12.9121 0.675799 13 1.00457 13C1.33333 13 1.58295 12.9121 1.75342 12.7364C1.91781 12.5546 2 12.3274 2 12.0548Z" fill="${colors[type]}"/>
            </svg>
        </div>
    </div>`;
    new Noty({
        type: types[type],
        layout: layouts[layout],
        theme: 'Notify',
        text: message,
        timeout: time,
        progressBar: progressBar,
        animation: {
            open: 'noty_effects_open',
            close: 'noty_effects_close'
        }
    }).show();
}
