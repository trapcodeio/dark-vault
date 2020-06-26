<template>
    <div class="container mt-5">
        <div class="box has-text-centered py-5">
            <h1 class="is-size-1 has-text-weight-bold">Dark Vault</h1>
            <p class="is-size-4 has-text-grey">A simple NodeJs File Manager</p>
            <hr class="mt-0 mb-5">
            <template v-if="config.auth">

                <div class="columns has-text-left">
                    <div class="column is-6-desktop is-offset-3-desktop">
                        <div class="message is-info">
                            <div class="message-body p-3">
                                <strong>Auth</strong> is enabled but no users added yet.
                            </div>
                        </div>

                        <h4 class="is-size-5 has-text-weight-bold has-text-info">Add Super User</h4>
                        <hr class="mt-0">
                        <form @submit.prevent="() => false" action="">
                            <div class="field">
                                <label class="label">Username:</label>
                                <div class="control">
                                    <input type="text" class="input shadow-sm" placeholder="e.g superuser">
                                </div>
                                <p class="help">Username and Password will be used to login.</p>
                            </div>

                            <div class="field">
                                <label class="label">Password:</label>
                                <div class="control">
                                    <input type="text" class="input shadow-sm" placeholder="Password">
                                </div>
                            </div>


                            <div class="field">
                                <label class="label">Confirm Password:</label>
                                <div class="control">
                                    <input type="text" class="input shadow-sm" placeholder="Repeat Password">
                                </div>
                            </div>

                            <div class="field">
                                <label class="label">Email:</label>
                                <div class="control">
                                    <input type="text" class="input shadow-sm" placeholder="e.g johndoe@app.com">
                                </div>
                                <p class="help">Email is only for important notifications if enabled.</p>
                            </div>

                            <div class="mt-3">
                                <button class="button is-primary is-fullwidth is-medium has-text-weight-bold">
                                    <i class="fas fa-check mr-2" aria-hidden="true"></i> Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </template>
            <template v-else>
                <p>Your files are waiting for you...</p>
                <div class="mt-2">
                    <router-link :to="rl('folder', {folder_path: basePath})" class="button is-info is-rounded is-medium"
                                 role="button"><i class="fa fa-folder mr-2"></i> Files &
                        Directories
                    </router-link>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        data() {
            return {
                basePath: btoa('base://')
            }
        },

        computed: {
            ...mapState(['config'])
        }
    }
</script>
