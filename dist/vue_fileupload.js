define(['jquery', 'dropzone'], function($, Dropzone) {
    "use strict";

    return {
        template: "<div class='fileupload' v-bind:class='status'><div class='progressbar' v-bind:style='{width: progressbar_width}'></div><div class='content dz-message'><slot></slot></div></div>",
        props: ['fileTypes', 'url', 'params', 'options'],
        data: function() {
            return {
                dropzone: null,
                progress: 0,
                status: 'ready'
            };
        },
        mounted: function() {
            var self = this;

            self.dropzone = new Dropzone(self.$el, $.extend({
                url: self.url,
                params: self.params,
                acceptedFiles: self.fileTypes,
                init: function() {
                    this
                    .on('dragover', function() {
                        self.status = 'hover';
                    })
                    .on('dragleave mouseleave', function() {
                        self.status = 'ready';
                    })
                    .on('uploadprogress', function(evt, progress) {
                        if (progress) {
                            self.progress = progress / 100.0;
                        }
                        self.status = 'sending';
                        self.$emit('progress', self.progress);
                    })
                    .on('success', function(files, response) {
                        self.progress = 0;
                        self.status = 'success';
                        self.$emit('success', response);
                    })
                    .on('error', function(files, reason) {
                        self.progress = 0;
                        self.status = 'error';
                        self.$emit('error', reason);
                    });
                }
            }, self.options));
        },
        watch: {
            options: function() {
                if (this.options) {
                    $.extend(this.dropzone.options, this.options);
                }
            },
            url: function() {
                this.dropzone.options.url = this.url;
            },
            params: function() {
                this.dropzone.options.params = this.params;
            }
        },
        computed: {
            progressbar_width: function() {
                return this.progress ? (this.progress * 100) + '%' : 0;
            }
        }
    };
});