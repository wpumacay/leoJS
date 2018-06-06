/// <reference path="RBoot.ts" />
var leojs;
(function (leojs) {
    var REntryPoint = /** @class */ (function () {
        function REntryPoint() {
        }
        REntryPoint.include = function (file) {
            document.write('<script type="text/javascript" languaje="javascript" src="' +
                file + '"></script>');
        };
        REntryPoint.begin = function () {
            var _files = leojs.EntryPointFiles;
            var _i;
            for (_i = 0; _i < _files.length; _i++) {
                REntryPoint.include(_files[_i]);
            }
        };
        return REntryPoint;
    }());
    leojs.REntryPoint = REntryPoint;
})(leojs || (leojs = {}));
