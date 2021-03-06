$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})

$(document).on("click", "[data-show-room-stat]", function(e) {
	$(this).blur();
	e.preventDefault();
	var id = $(this).data('show-room-stat');
	var name = $(this).data('room-name');
	$.post("//"+document.domain+"/public/top.php", {'room': id}, function(table){
		if(table.length != 0){
			$("#donRoomTable tr:first th:first").html(name);
			$("#donRoomTable tbody").html(table);
			$('#donRoomModal').modal('show');
		}
	});
	
	$.post("//"+document.domain+"/public/all.php", {'room': id}, function(msg){
		$("#allIncome").html("<hr/><center><b>All time income: "+msg+" USD</b></center><hr/>");
	});
	
	$.post("//"+document.domain+"/public/chart.php", {'room': id}, function(json){
		xx11 = JSON.parse(json);
		var xx22 = MG.convert.date(xx11, 'date');
		MG.data_graphic({
			data: xx22,
			width: 380,
			height: 120,
			right: 10,
			missing_is_zero: true,
			top: 30,
			bottom: 0,
			left: 40,
			target: document.getElementById('modelChart'),
			x_accessor: 'date',
			y_accessor: 'value',
			//color: ['#25639a'],
			x_axis: false,
		});
	});
});

$(document).ready(function() {
    var table = $("#main").DataTable({
        order: [
            [5, "desc"]
        ],
        "iDisplayLength": 10,
        "columns": [{
                "searchable": false,
                "orderable": false
            },
            {
                "orderable": false
            },
            {
                "orderable": false
            },
            {
                "orderable": false
            },
            {
                "searchable": false
            },
            {
                "searchable": false
            },
        ]
    });
});

function printWsText(text){
	if(text.length > 0){
		date = new Date();
		xMin = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
		xSec = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
		time = date.getHours() + ":" + xMin + ":" + xSec;
		$(".wstext").prepend('<div class="message">[' + time + '] ' + text + '</div>');
		msg = $('.wstext .message');
		if (msg.length > 8) {
			msg.last().remove();
		}
	}
}

function printOnlineStat(){
	$.get("//"+document.domain+"/public/online.php", function(text){
		if(text.length > 0){
			printWsText(text);
		}
	});
}

$(document).ready(function() {
	setTimeout(function getOnlineStat() {
		printOnlineStat();
		setTimeout(getOnlineStat, 60000);
	}, 1000);
});

function bStat() {
    var sock = new WebSocket('wss://chaturbate100.com/ws/');
    sock.onopen = function() {
        console.log('open');
        setTimeout(function wsPing() {
            sock.send('o')
            setTimeout(wsPing, 10000);
        }, 10000);
        $(".wstext").prepend('<div class="message"><center>------------------------------------ last big tips ------------------------------------</center></div>');
    };
    sock.onmessage = function(evt) {
		j = JSON.parse(evt.data);
		if(Math.floor(Math.random() * 5) == 1){
			$("#trackCount").html("<a href=\"https://chaturbate100.com/?list\">track "+j.trackCount+" rooms</a>");
		}
        text = "<a href='/public/move.php?room="+j.donator+"' target='_blank'>"+j.donator+"</a> send "+j.amount+" tokens to <a href='/public/move.php?room="+j.room+"' target='_blank'>"+j.room+"</a>";
        if(j.amount > 499){
			text = '<font color="#ae8d0b"><b>' +  text + '</b></font>';
		}
		printWsText(text);
    };
    sock.onclose = function() {
        console.log('close');
    };
}
bStat();

$(document).ready(function() {
	$("#donTopLink").show();
});
