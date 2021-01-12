'use strict';

trinl.directive('detectFocus', [ function() {
    return {
        'restrict' : 'AC',
        'link' : function(scope, elem) {

            elem.on('focus', function() {
//console.log(attrs.name + ' has focus!');
                scope.$apply( function() {
                    scope.$emit('elemHasFocus', {
                        message: elem[0].placeholder
                    });
                });
            });

            elem.on('blur', function() {
//console.log(attrs.name + ' lost focus');
            });
        }
    };
}]);