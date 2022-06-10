<template>
  <v-container fluid grid-list-md class="">
    <v-row no-gutters class="px-12 mx-12">
      <v-col>
        <div class="d-flex pb-2" style="width:600px;">
          <v-text-field solo dense placeholder="Masukkan nama tempat yang dituju..." hide-details v-model="searchEngine" class="text mb-6 elevation-2"></v-text-field>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="searchPlaces(searchEngine)" outlined rounded icon 
                v-bind="attrs" v-on="on" class="ml-6 mt-1 shadow" color="green">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
            <span>Cari</span>
          </v-tooltip>
        </div>
        <div class="d-flex sortSelection mb-7" style="width:750px;">
          <v-select label="Filter berdasarkan" outlined dense :items="filterList" hide-details v-model="filterDefault" @input="changeSortMethod" class="mr-12 shadow-2" />
          <v-select label="Urut berdasarkan" outlined dense :items="sortList" hide-details v-model="sortDefault" @input="changeSortMethod" class="ml-6 shadow-2" />
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col v-for="item in this.favoritePlaces[0]" :key="item.id">
        <v-card class="my-4 card">
          <v-row no-gutters>
            <v-img :src="item.image" class="imagePlace my-0 mx-0" height="240" /> 
          </v-row>
          <v-row no-gutters>
            <v-spacer />
              <v-card-title class="mt-4"> {{ item.name }}
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="removeFromWishlist(item)" outlined rounded icon 
                      v-bind="attrs" v-on="on" class="shadow ml-4" color="green">
                      <v-icon>mdi-bookmark</v-icon>
                    </v-btn>
                  </template>
                  <span>Hapus dari favorit</span>
                </v-tooltip>
              </v-card-title>
              <v-spacer />
              <v-card-text class="full-height pa-2 d-flex flex-column text-left">
                <p>
                  <v-icon class="ml-2 mr-4" color="green">mdi-text</v-icon>
                  {{ item.desc }}
                </p>
                <p>
                  <v-icon class="ml-2 mr-4 my-2" color="green">mdi-map-marker</v-icon>
                  {{ item.address }}
                </p>
                <p>
                  <v-icon class="ml-2 mr-4" color="green">mdi-cash-multiple</v-icon>
                  {{ item.entryFee }}
                </p>
              </v-card-text>
          </v-row>
          
          <v-card-actions>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="deleteSnackbar" :timeout="timeout">
      Tempat favorit berhasil dihapus!
      <template v-slot:action="{ attrs }">
        <v-btn color="red darken-2" text v-bind="attrs" @click="deleteSnackbar=false">Tutup</v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script>
import WishlistService from '@/services/WishlistService'

export default {
  data() {
    return {
      favoritePlaces: [],
      tempResult: [],
      searchEngine: null,
      timeout: 4000,
      deletePlaceDialog: false,
      deleteSnackbar: false,
      sortList: ["None", "Nama", "Pertama Kali", "Terakhir Kali"],
      sortDefault: "None",
      filterList: ["None", "Pantai", "Gunung", "Taman", "Museum", "Bukit", "Biaya (0 - 5.000)", "Biaya (5.000 - 25.000)", "Biaya (25.000 - 50.000)"],
      filterDefault: "None",
      searchEngine: '',
    }
  },
  async mounted() {
    this.showFavoritePlaceList()
  },
  methods: {
    async removeFromWishlist(item) {
      await WishlistService.removeFromWishlist({userId: this.$store.state.user.userId, placeId: item.placeId})
      this.favoritePlaces.splice(this.favoritePlaces.indexOf(item), 1)
      this.deleteSnackbar = true
      this.showFavoritePlaceList()
    },
    searchPlaces(searchEngine) {
      this.favoritePlaces.splice(0)
      WishlistService.searchPlaces({userId: this.$store.state.user.userId, searchEngine: searchEngine, sort: this.sortDefault})
        .then(a => (this.favoritePlaces.push(a.data)))
      this.filterDefault = "None"
    },
    changeSortMethod() {
      this.favoritePlaces.splice(0)
      this.showFavoritePlaceList()
    },
    showFavoritePlaceList() {
      WishlistService.showFavoritePlaceList({userId: this.$store.state.user.userId, sort:this.sortDefault, filter: this.filterDefault})
        .then(a => (this.favoritePlaces.push(a.data)))
    },
  },
}
</script>

<style>

.searchBar {
  width: 350px;
}

.card {
  height: 520px;
  width: 680px;
  margin-left: 30px;
}

.itemText {
  margin-top: 90px;
  margin-left: 30px;
}

</style>