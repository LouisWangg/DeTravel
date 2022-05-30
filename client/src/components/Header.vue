<template>
    <v-container v-if="$route.name == 'root' || $route.name == 'favorit' || $route.name == 'admin'" fluid class="mb-8 py-0 px-0">
        <v-toolbar class="headerToolbar elevation-4" style="width: 100%; height: 67px;">
            <v-app-bar-nav-icon class="ml-1" @click.stop="drawer= !drawer" />
            <img src="@/assets/logo_size1.jpg" />
        </v-toolbar>
        
        <v-navigation-drawer v-if="$store.state.isLoggedIn || !$store.state.isLoggedIn || !$store.state.user.name.toLowerCase().includes('admin')"
            v-model="drawer" absolute bottom temporary class="headerToolbar">
            <v-list>
                <v-list-item-content>
                    <img src="@/assets/logo_size1.jpg" />
                    <v-list-subtitle v-if="$store.state.isLoggedIn" class="mt-5">
                        <span class="green--text text--darken-4 size">Halo, {{ $store.state.user.name }}!</span>
                    </v-list-subtitle>
                </v-list-item-content>
            </v-list>

            <v-divider />
            
            <v-list nav>
                <v-list-item-group v-model="model" active-class="green--text text--darken-2">
                    <v-list-item @click="navigateTo({name: 'root'})">
                        <v-icon class="ml-3">mdi-home</v-icon>
                        <v-list-item-content class="mr-16 pr-8">
                            <v-list-item-title>Home</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="$store.state.isLoggedIn" @click="navigateTo({name: 'favorit'})">
                        <v-icon class="ml-3">mdi-heart</v-icon>
                        <v-list-item-content class="mr-16 pr-8">
                            <v-list-item-title>Favorit</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="!$store.state.isLoggedIn" @click="navigateTo({name: 'login'})">
                        <v-icon class="ml-3">mdi-heart</v-icon>
                        <v-list-item-content class="mr-16 pr-8">
                            <v-list-item-title>Favorit</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="!$store.state.isLoggedIn" @click="navigateTo({name: 'login'})">
                        <v-icon class="ml-2 pl-1">mdi-login</v-icon>
                        <v-list-item-content class="mr-16 pr-8">
                            <v-list-item-title>Masuk</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="$store.state.isLoggedIn" @click="logout">
                        <v-icon class="ml-3 pl-1">mdi-logout</v-icon>
                        <v-list-item-content class="mr-16 pr-8">
                            <v-list-item-title>Keluar</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>

        <v-navigation-drawer v-if="$store.state.isLoggedIn && $store.state.user.name.toLowerCase().includes('admin')" 
            v-model="drawer" absolute bottom temporary class="headerToolbar">
            <v-list>
                <v-list-item-content>
                    <img src="@/assets/logo_size1.jpg" />
                    <v-list-subtitle class="mt-5">
                        <span class="green--text text--darken-4 size">Halo, {{ $store.state.user.name }}!</span>
                    </v-list-subtitle>
                </v-list-item-content>
            </v-list>

            <v-divider />
            
            <v-list nav>
                <v-list-item-group v-model="model" active-class="green--text text--darken-2">
                    <v-list-item @click="navigateTo({name: 'admin'})">
                        <v-icon class="ml-3">mdi-home</v-icon>
                        <v-list-item-content class="mr-16 pr-8">
                            <v-list-item-title>Home</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="logout">
                        <v-icon class="ml-3 pl-1">mdi-logout</v-icon>
                        <v-list-item-content class="mr-16 pr-8">
                            <v-list-item-title>Keluar</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </v-container>
</template>

<script>

export default {
    data() {
        return {
            drawer: false,
            group: null,
            model: 1,
            items: [
                { title: 'Home', icon: 'mdi-home' },
                { title: 'Favorit', icon: 'mdi-heart' },
                { title: 'Keluar', icon: 'mdi-export' },
            ]
        }
    },
    async mounted () {
    },
    methods: {
        navigateTo (route) {
            this.$router.push(route)
        },
        logout () {
            this.$store.dispatch('setToken', null)
            this.$store.dispatch('setUser', null)
            this.$router.push('/')
        }
    },
    watch: {
        group () {
            this.drawer = false
        }
    },
}
</script>

<style scoped>
.headerToolbar {
    background: linear-gradient(350deg, #EFFFEB, #FFFFFF);
    box-shadow: 0 3px 7px 0 rgb(0 0 0 / 35%);
}

.size {
    font-size: 18px;
}

.header {
    cursor: pointer;
    font-size: 19px;
}

.header:hover {
    color: #008F24;
}

.shadow {
    background-color: #c9f4d3;
    box-shadow: 15px 0 30px 0 #c9f4d3;
}
</style>
