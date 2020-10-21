<template>
    <div class="columns has-text-left">
        <div class="column is-6-desktop is-offset-3-desktop is-8-tablet is-offset-2-tablet">
            <div class="message is-info">
                <div class="message-body p-2">
                    <strong>Auth</strong> is enabled but no users added yet.
                </div>
            </div>
            <h4 class="is-size-5 has-text-weight-bold has-text-info">Add Super User</h4>
            <hr class="mt-0">
            <form @submit.prevent="() => false" action="">
                <div class="field">
                    <label class="label">Username:</label>
                    <div class="control">
                        <input v-model="form.username" type="text" class="input shadow-sm" placeholder="e.g superuser">
                    </div>
                    <p class="help">Username and Password will be used to login.</p>
                </div>

                <div class="field">
                    <label class="label">Password:</label>
                    <div class="control">
                        <input v-model="form.password" type="password" class="input shadow-sm" placeholder="Password">
                    </div>
                </div>

                <div class="field">
                    <label class="label">Confirm Password:</label>
                    <div class="control">
                        <input v-model="form.confirm_password" type="password" class="input shadow-sm"
                               placeholder="Repeat Password">
                    </div>
                </div>

                <div class="field">
                    <label class="label">Email:</label>
                    <div class="control">
                        <input v-model="form.email" type="text" class="input shadow-sm"
                               placeholder="e.g johndoe@app.com">
                    </div>
                    <p class="help">Email is required for password resets only.</p>
                </div>

                <div class="mt-3">
                    <button @click="addSuperUser" class="button is-primary is-fullwidth is-medium has-text-weight-bold">
                        <i class="fas fa-check mr-2" aria-hidden="true"></i> Proceed
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
    import {Abolish} from "abolish";

    export default {
        name: 'AddSuperUser',
        data() {
            return {
                form: {
                    username: 'superuser',
                    password: '123456',
                    confirm_password: '12345',
                    email: 'dark@vault.com'
                }
            }
        },

        methods: {
            addSuperUser() {
                const {error} = Abolish.validate(this.form, {
                    username: 'must|minLength:4|maxLength:20',
                    password: 'must|minLength:6',
                    confirm_password: {
                        must: true,
                        exact: this.form.password,
                        $error: 'Password and confirmation password does not match!'
                    },
                    email: 'must'
                });

                if (error) {
                    return this.$toast.error(error.message);
                }

                return this.$toast.success('Operation successful!')
            }
        }
    }
</script>