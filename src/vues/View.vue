<template>
    <div class="container">
        <div class="card mt-3 mt-lg-5 shadow is-fixed-height">
            <div class="card-body p-0">
                <template v-if="isLoading">
                    <div class="text-center mt-5">
                        <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="p-2">
                        <div class="clearfix mb-3">
                            <router-link :to="rl('folder', {folder_path: file.encodedDirectory})"
                                         class="btn btn-dark btn-sm"><i class="fa fa-arrow-left mr-1"></i> Go
                                Back
                            </router-link>
                        </div>

                        <h4 class="mb-1">{{fileName}}</h4>
                        <small class="text-muted">{{file.fullPath}}</small>
                    </div>

                    <div v-if="file.type==='image'" class="mt-5 text-center">
                        <img :src="file.content" class="img-thumbnail">
                    </div>
                    <div v-else class="mt-5">
                        <PrismEditor :code="file.content" :language="fileExt" :readonly="true"
                                     :lineNumbers="true" :autoStyleLineNumbers="true"></PrismEditor>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import "prismjs"
    import "prismjs/themes/prism-tomorrow.css";
    import "vue-prism-editor/dist/VuePrismEditor.css";

    import PrismEditor from 'vue-prism-editor';

    export default {
        components: {PrismEditor},
        data() {
            return {
                isLoading: true,
                hasData: false,
                file: {
                    content: '',
                    fullPath: ''
                }
            }
        },

        computed: {
            fileName() {
                const slashSplit = this.file.fullPath.split('/');
                if (slashSplit.length > 0) {
                    return slashSplit[slashSplit.length - 1];
                }
                return this.file.fullPath;
            },

            fileExt() {
                const slashSplit = this.file.fullPath.split('.');
                if (slashSplit.length > 0) {
                    return slashSplit[slashSplit.length - 1];
                }
                return '';
            }
        },

        mounted() {
            const filePath = this.$route.params['file_path'];
            this.$api.postTo('api/file/read', {file: filePath}, {
                yes: (data) => {
                    this.file = data;
                },
                no: () => {
                    this.hasData = false;
                },
                any: () => {
                    this.isLoading = false;
                }
            })
        }
    }
</script>
