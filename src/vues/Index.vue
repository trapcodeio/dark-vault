<template>
    <div class="container mt-5">
        <div class="box has-text-centered py-5">
            <h1 class="is-size-1 has-text-weight-bold">Dark Vault</h1>
            <p class="is-size-5 has-text-grey">A simple NodeJs File Manager</p>
            <hr class="mt-0 mb-5">
            <template v-if="config.auth">
                <AddSuperUser/>
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
    import AddSuperUser from "./AddSuperUser";

    export default {
        components: {AddSuperUser},
        data() {
            return {
                basePath: btoa('base://'),
            }
        },

        computed: {
            ...mapState(['config'])
        }
    }
</script>
