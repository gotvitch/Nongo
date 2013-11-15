(function () {
    'use strict';

    var Nongo = {
        Layouts     : {},
        Views       : {},
        Collections : {},
        Models      : {},
        Templates   : {}
    };

    _.extend(Nongo, Backbone.Events);

    _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

    window.Nongo = Nongo;

    $(function () {
        Nongo.appView = new Nongo.Views.App();
        Nongo.app = new Nongo.Router();

        $(document).on('click', 'a[data-link=push]', function (event) {
            if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                event.preventDefault();
                var url = $(event.currentTarget).attr('href');

                return Nongo.app.navigate(url, { trigger: true });
            }
        });
        
        Backbone.history.start({ pushState: true });
        
    });
}());

(function () {
    'use strict';

    Nongo.Router = Backbone.Router.extend({
        routes: {
            'test': 'test',
            'databases/:database/collections/:collection': 'collection',
            'databases/:database': 'database',
            '*actions': 'defaultRoute',
            ':notFound': 'notFound'
        },
        test: function(){
            Nongo.appView.showTest();
        },
        database: function(database){
            Nongo.appView.showDatabase(database);
        },
        collection: function(database, collection){
            Nongo.appView.showCollection(database, collection);
        },
        defaultRoute: function () {
            Nongo.appView.showHome();
        }
    });
}());



(function () {
    'use strict';

    Nongo.Tool = Nongo.Tool || {};

    Nongo.Tool.BSON = {
        
        getIndentation: function(level, indentation) {
            var pad;
            if (indentation) {
                pad = '\n';
                _.times(level * indentation, function() {
                    return pad += ' ';
                });
                return pad;
            } else {
                return ' ';
            }
        },

        toBsonString: function(obj, options) {

            var emptyObject, level, result, indentation;
            if (options == null) {
                options = {};
            }

            if (options.indentation != null) {
                indentation = options.indentation;
            } else {
                indentation = 4;
            }

            level = options.level || 0;
            result = '';
            emptyObject = true;


            if (obj instanceof Array) {
                result += '[';
            } else if (obj instanceof Object) {
                result += '{';
            }


            _.each(obj, function(value, key){

                emptyObject = false;
                result += Nongo.Tool.BSON.getIndentation(level + 1, indentation);

                // Add key for object
                if(!(obj instanceof Array)){
                    if(options.html){
                        result += '<span class="key">' + key + '</span>: ';
                    }else{
                        result += '' + key + ': ';
                    }
                    
                }

                if(typeof(value) === 'object' && value !== null){
                    if(value['$oid'])
                    {
                        if (options.html) {
                            result += '<span class="function">ObjectId</span>(<span class="string">"' + value['$oid'] + '"</span>),';
                        } else {
                            result += 'ObjectId("' + value['$oid'] + '"),';
                        }
                        
                    }
                    else if(value['$date'])
                    {
                        if (options.html) {
                            result += '<span class="function">ISODate</span>(<span class="string">"' + value['$date'] + '"</span>),';
                        } else {
                            result += 'ISODate("' + value['$date'] + '"),';
                        }
                    }
                    else if(value['$timestamp'])
                    {
                        if (options.html) {
                            result += '<span class="function">Timestamp</span>(' + value['$timestamp'].t + ', ' + value['$timestamp'].i + '),';
                        } else {
                            result += 'Timestamp(' + value['$timestamp'].t + ', ' + value['$timestamp'].i + '),';
                        }
                    }
                    else if(value['$ref'])
                    {
                        if (options.html) {
                            result += '<span class="function">DBRef</span>(<span class="string">"' + value['$ref'] + '"</span>, ';
                            result += '<span class="function">ObjectId</span>(<span class="string">"' + value['$id']['$oid'] + '"</span>';
                            if(!_.isEmpty(value['$ref'].db)){
                                result += ', <span class="string">"' + value['$db'] + '"</span>';
                            }
                            result += '),';
                        } else {
                            result += 'DBRef("' + value['$ref'] + '", ObjectId("' + value['$id']['$oid'] + '")';
                            if(!_.isEmpty(value['$db'])){
                                result += ', "' + value['$db'] + '"';
                            }
                            result += '),';
                        }
                    }
                    else
                    {
                        result += Nongo.Tool.BSON.toBsonString(value,{
                            level: level + 1,
                            indentation: indentation,
                            html: options.html
                        });
                        result += ',';
                    }
                }else{
                    if (options.html) {
                        var className = 'string';
                        if (value === false || value === true || value === null) {
                            className = 'value';
                        }
                        if (typeof value === 'number') {
                            className = 'number';
                        }
                        result += '<span class="' + className + '">"' + (value === null ? 'null' : value)  + '"</span>,';
                    } else {
                        if (value === false || value === true || typeof value === 'number'  || value === null) {
                            result += '' + (value === null ? 'null' : value) + ',';
                        }else{
                            result += '"' + (value === null ? 'null' : value) + '",';
                        }
                    }
                }
            });


            if (result.slice(-1) === ',') {
                result = result.slice(0, -1);
            }

            if (!emptyObject) {
                result += Nongo.Tool.BSON.getIndentation(level, indentation);
            }

            if (obj instanceof Array) {
                return result += ']';
            } else if (obj instanceof Object) {
                return result += '}';
            }
        },
        sanitizeRegex: function(json) {
            var p, regexp_parts, v;
            for (p in json) {
                v = json[p];
                if (v instanceof RegExp) {
                    regexp_parts = v.toString().match(/^\/(.*)\/([gim]*)$/);
                    json[p] = {
                        $regex: regexp_parts[1],
                        $options: regexp_parts[2]
                    };
                } else if (p === '$oid' && typeof v === 'undefined') {
                    json[p] = window.dblayer.page_data.document_oids.shift();
                } else if (p === '$date' && typeof v === 'undefined') {
                    json[p] = (new Date()).getTime();
                } else if (typeof v === 'object') {
                    json[p] = this.sanitizeRegex(v);
                }
            }
            return json;
        },
        bsonEval: function(src) {
            var json, mask, p, v;
            try {
                mask = {};
                for (p in this) {
                    v = this[p];
                    mask[v] = void 0;
                }
                mask.ObjectId = function(id) {
                    return {
                        $oid: id
                    };
                };
                mask.Date = function(date) {
                    return {
                        $date: date
                    };
                };
                mask.ISODate = function(date) {
                    return {
                        $date: (new Date(date)).getTime()
                    };
                };
                mask.Timestamp = function(t, i) {
                    return {
                        $timestamp: {
                            't': t,
                            'i': i
                        }
                    };
                };
                mask.DBRef = function(name, id, db) {
                    return {
                        '$ref': name,
                        '$id': id,
                        '$db': db
                    };
                };

                mask.Binary = function(v) {
                    throw 'Cannot save documents with Binary values';
                };
                json = (new Function('with(this){ return ' + src + ' }')).call(mask);
                return this.sanitizeRegex(json);
            } catch (error) {
                throw error;
            }
        }
    };
}());
(function () {
    'use strict';
    Handlebars.registerHelper('humanizeByte', function (bytes) {

        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        if (bytes === 0) {
            return 'n/a';
        }
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), null);
        if (i === 0) {
            return bytes + ' ' + sizes[i];
        }

        var size = (bytes / Math.pow(1024, i));

        return (Math.round(size * 100) / 100) + ' ' + sizes[i];
    });

    Handlebars.registerHelper('humanizeCount', function (count) {

        var suffix = '';
        count = count || 0;

        if (count > 1000) {
            count  = Math.floor(count / 1000);
            suffix = ' k';
        }

        if (count > 1000) {
            count  = Math.floor(count / 1000);
            suffix = ' M';
        }

        if (count > 1000) {
            return '...';
        }

        return count + suffix;
    });


    
}());
