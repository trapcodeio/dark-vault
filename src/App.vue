<template>
    <div id="app" class="container">
        <div class="card mt-5 shadow">
            <div class="card-body">
                <h3>Dark Vault</h3>

                <ol v-if="currentFolderToArray.length" class="breadcrumb mt-5">
                    <template v-for="(path, pathId) in currentFolderToArray">
                        <template v-if="currentFolderToArray[pathId+1]!==undefined">
                            <li class="breadcrumb-item"><a @click.prevent="fromBreadcrumb(pathId)" href="#">{{path}}</a>
                            </li>
                        </template>
                        <template v-if="currentFolderToArray[pathId+1]===undefined">
                            <li class="breadcrumb-item active">{{path}}</li>
                        </template>
                    </template>
                </ol>

                <template v-if="isLoading">
                    <div class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                </template>
                <div class="mt-4" v-if="!isLoading">
                    <div class="row">
                        <div class="col-auto">
                            <a href="#" @click.prevent="goBack" class="btn btn-dark btn-sm mt-2"><i
                                    class="fas fa-arrow-left "></i> Go Back</a>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <input @focusin.prevent="focusedIn" @focusout.prevent="focusedOut" v-model="search"
                                       type="text" :placeholder="currentFolder" class="form-control shadow-sm">
                            </div>
                        </div>

                        <div class="col-12" v-if="errorMessage.length">
                            <div class="alert alert-danger" role="alert">
                                <i class="fas fa-exclamation-triangle mr-2"></i> <span v-html="errorMessage"></span>

                                <button @click.prevent="errorMessage=''" type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <template v-for="folder  in files">
                        <template v-if="folder.isDir">
                            <a :href="folder.fullPath" :title="folder.fullPath"
                               @click.prevent="loadFolder(folder.fullPath)">
                                <i class="fas fa-folder mr-3"></i><span>{{folder.name}}</span>
                            </a>
                            <hr class="mt-1">
                        </template>
                    </template>
                    <template v-for="file in files">
                        <template v-if="!file.isDir">
                            <i class="fa fa-file fa-1x mr-3 text-muted"></i>
                            <span v-if="file.name[0]==='.'" title="Hidden File" class="text-muted">{{file.name}}</span>
                            <span v-if="file.name[0]!=='.'" :title="file.fullPath">{{file.name}}</span>
                            <hr class="mt-1">
                        </template>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isLoading: true,
                isSearching: false,
                dirtyByComputer: true,
                currentFolder: '',
                files: ['.git'],
                search: '',
                watchSearch: true,
                searchTimeOut: -1,

                errorMessage: ''
            };
        },

        computed: {
            currentFolderToArray() {
                let folder = this.currentFolder;
                if (folder.substr(-1) === '/') {
                    folder = folder.substr(0, folder.length - 1);
                }
                return folder.split('/')
            }
        },

        watch: {
            search() {
                if (this.search.length > 0) {
                    if (!this.dirtyByComputer) {
                        const self = this;

                        clearTimeout(this.searchTimeOut);

                        // Uncomment these lines to make search slow.
                        // this.searchTimeOut = setTimeout(() => {
                            self.loadFolder(this.search)
                        // }, 300);
                    }

                    this.dirtyByComputer = false;
                }
            }
        },

        mounted() {
            const self = this;
            setTimeout(() => {
                self.loadFolder();
            }, 500);
        },

        methods: {
            loadFolder(id) {
                if (!this.isSearching) {
                    this.isLoading = true;
                }

                let params = {};
                if (typeof id === "number") {
                    params.folder = this.files[id].fullPath;
                } else if (typeof id == "string") {
                    params.folder = id;
                }

                const self = this;
                window.$api.postTo('folder/scan', params, {
                    yes(data) {
                        self.errorMessage = '';
                        self.files = data.files;
                        self.currentFolder = data.folder;
                    },

                    no(result){
                      self.showError(result.data);
                    },

                    any(){
                        self.isLoading = false;
                    }
                })
            },

            fromBreadcrumb(stopAtId) {
                let currentPath = this.currentFolderToArray;

                const folder = currentPath.slice(0, stopAtId + 1).join('/');

                return this.loadFolder(folder);
            },

            goBack() {
                return this.fromBreadcrumb(this.currentFolderToArray.length - 2)
            },

            focusedIn() {
                this.isSearching = true;
                if (!this.search.length) {
                    this.search = this.currentFolder;
                    this.dirtyByComputer = true;
                }
            },

            focusedOut() {
                this.isSearching = false;
                if (this.dirtyByComputer) {
                    this.search = "";
                }
            },

            showError(msg){
                this.errorMessage = msg;

                const self = this;

                setTimeout(()=>{
                    self.errorMessage = '';
                }, 10000);
            }
        }
    }
</script>
