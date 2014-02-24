$(function(){
    function trend(){
        var opt = {
            today: '2014-02-20',
            maxDate: '2014-02-20',
            minDate: '2010-01-20',
            selectDate: '2014-01-20至2014-02-18',
            id: 'inputId1',
            panelCounts: 3
        }
        calendar = new Calendar(opt);
        calendar.containerNode.on("calendar.event.submit", function(e, selectDate){
           alert(selectDate) 
        });
        calendar.containerNode.on("calendar.event.cancle", function(e, selectDate){
           alert(selectDate) 
        });
    }
    
    function compare(){
        var opt = {
            today: '2014-02-20',
            maxDate: '2014-02-20',
            minDate: '2010-01-20',
            selectDate: '2014-01-20至2014-02-18',
            id: 'inputId2',
            showPosition: 'right',
            panelCounts: 3
        }
        new Calendar(opt);
    }
    
    function upDown(){
        var opt = {
            today: '2014-02-20',
            maxDate: '2014-02-20',
            minDate: '2010-01-20',
            selectDate: '2014-02-18',
            id: 'inputId3',
            panelCounts: 1
        }
        new Calendar(opt);
    }
    
    
    function swarmval(){
        var tabWeek = $('#tabWeek'), tabMonth = $('#tabMonth'), inputId4 = $('#inputId4');
        var weekContent = $('#weekContent'), monthContent = $('#monthContent'), mainContainer = $('#mainContainer'); 
        inputId4.val('2014-02-20至2014-02-18');
        tabWeek.on('click', function(){
            tabWeek.addClass('selected')
            tabMonth.removeClass('selected')
            weekContent.show();
            monthContent.hide();
            var opt = {
                today: '2014-02-20',
                maxDate: '2014-02-20',
                minDate: '2010-01-20',
                selectDate: '2014-02-20至2014-02-18',
                id: inputId4.attr('id'),
                isSelectWeek: 1,
                isReadOnly: 1,
                panelCounts: 3,
                isClickDocClose: 1,
                parentContainer : weekContent
            }
            var calendar = new Calendar(opt);
            calendar.containerNode.on('calendar.event.hidecb', function(){
                mainContainer.hide();
            });
            calendar.containerNode.trigger('calendar.event.show');
        });
        tabMonth.on('click', function(){
            tabMonth.addClass('selected')
            tabWeek.removeClass('selected')
            monthContent.show();
            weekContent.hide();
        });
        inputId4.on({
            'focus click': function(){
                mainContainer.css({'left': $(this).offset().left, 'top': $(this).offset().top + 20}).show();
                tabWeek.trigger('click');
            }
        }); 
    }
    
    trend();
    compare();
    upDown();
    swarmval();
});
