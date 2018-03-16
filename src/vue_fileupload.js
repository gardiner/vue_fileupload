define(['jquery', 'dropzone'], function($) {
    "use strict";

    return {
        template: "[[vue_fileupload.html]]",
        props: ['fileTypes', 'url', 'params'],
        data: function() {
            return {
                progress: 0,
                status: 'ready'
            };
        },
        mounted: function() {
            var self = this;

            self.dropzone = new Dropzone(self.$el, {
                url: function() { return self.url; },
                params: self.params,
                acceptedFiles: self.fileTypes,
                init: function() {
                    this
                    .on('dragover', function() {
                        self.status = 'hover';
                    })
                    .on('uploadprogress', function(evt, progress) {
                        if (progress) {
                            self.progress = progress / 100.0;
                        }
                        self.status = 'sending';
                    })
                    .on('success', function() {
                        self.progress = 0;
                        self.status = 'success';
                    })
                    .on('error', function() {
                        self.progress = 0;
                        self.status = 'error';
                    });
                }
            });
        },
        watch: {
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