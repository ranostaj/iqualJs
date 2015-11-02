/**
 * ReadUserFile Factory
 * @returns {undefined}
 */

"use strict";


(function() {

    angular.module( 'user.factories' )
            .factory( 'ReadUserFile', ReadUserFile );

    ReadUserFile.$inject = ['$q', '$http', '$rootScope', 'UserService'];

    function ReadUserFile( $q, $http, $rootScope, UserService ) {

        var factory = {
            readFile : readFile
        }

        return factory;


        ////////////////////////////


        /**
         * Read and process file
         * @param {type} file
         * @returns {$q@call;defer.promise}
         */
        function readFile( file ) {
            var reader = new FileReader();
            var deferred = $q.defer();
            var rows = [];

            reader.readAsText( file );
            reader.onerror = errorCsv;



            reader.onload = function( event ) {
                var csv = event.target.result;

                var allTextLines = csv.split( /\r\n|\n/ );

                // Prejdeme vsetky requests
                $q.all( allTextLines.map( function( line, i ) {
                    var data = line.split( ';' );
                    var id = Math.floor( (Math.random() * 10000000) + 1000000 );
                    rows.push( { id : id, name : data[0] + " " + data[1], username : data[2], imported : true } );
                    deferred.resolve( rows );
                } ) );


            };

            return deferred.promise;

        }



        /**
         * Error read CSV
         * @param {type} evt
         * @returns {undefined}
         */
        function errorCsv( evt ) {
            if ( evt.target.error.name == "NotReadableError" ) {
                alert( "Canno't read file !" );
            }
        }
    }


})();