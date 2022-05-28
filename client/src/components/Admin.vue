<template>
  <v-container grid-list-md>
    <v-row no-gutters>
      <v-col align="center">
        <div class="elevation-2 panel">
          <v-toolbar flat dense class="toolbarColor">
            <v-toolbar-title>Daftar Tempat</v-toolbar-title>
          </v-toolbar>

          <div class="d-flex mt-3 mb-2">
            <v-text-field dense placeholder="Masukkan nama tempat..." hide-details v-model="searchEngine" class="text ml-4 searchBar shrink"></v-text-field>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="searchPlaces(searchEngine)" outlined icon
                  v-bind="attrs" v-on="on" class="ml-6 shadow" color="green">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </template>
              <span>Cari</span>
            </v-tooltip>
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="addPlaceDialog=true, detailPlace={}" icon
                  color="green" outlined rounded  v-bind="attrs" v-on="on" class="mr-5 shadow">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Tambah</span>
            </v-tooltip>
          </div>
          <v-data-table :headers="headers" :items="places" class="elevation-1">
            <template v-slot:[`item.icons`]="{ item }">
              <v-icon v-if="item.name.toLowerCase().includes('pantai')">mdi-beach</v-icon>
              <v-icon v-if="item.name.toLowerCase().includes('gunung')">mdi-terrain</v-icon>
              <v-icon v-if="item.name.toLowerCase().includes('taman')">mdi-pine-tree</v-icon>
              <v-icon v-if="item.name.toLowerCase().includes('museum')">mdi-bank</v-icon>
              <v-icon v-if="item.name.toLowerCase().includes('bukit')">mdi-summit</v-icon>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="openEditDialog(item)" small outlined rounded icon 
                    v-bind="attrs" v-on="on" class="mr-5 shadow" color="green">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Detail</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="openDeleteDialog(item)" small outlined rounded icon 
                    v-bind="attrs" v-on="on" class="shadow" color="green">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Hapus</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="addPlaceDialog" dark width="800">
      <v-card>
        <v-row no-gutters>
          <v-col>
            <v-card-title class="headline">Tambah Tempat</v-card-title>
            <v-card-text class="detailPlaceText">
              <v-text-field label="Nama tempat" v-model="detailPlace.name" />
              <v-textarea label="Deskripsi" v-model="detailPlace.desc" />
              <v-textarea label="Alamat" v-model="detailPlace.address" rows="3" />
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-text class="detailPlaceText mt-12">
              <v-text-field label="Latitude" v-model="detailPlace.latitude" />
              <v-text-field label="Longitude" v-model="detailPlace.longitude" />
              <v-text-field label="Biaya masuk / orang (Rp)" v-model="detailPlace.entryFee" />
              <v-textarea label="URL Gambar" v-model="detailPlace.image" />
            </v-card-text>
          </v-col>
        </v-row>
        
        <v-card-actions>
          <v-spacer />
          <v-btn @click="addPlace()" color="blue darken-2 mb-3">Tambah</v-btn>
          <v-spacer />
          <v-btn @click="addPlaceDialog=false" color="red darken-2 mb-3">Batal</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="addSnackbar" :timeout="timeout">
      Penambahan berhasil!
      <template v-slot:action="{ attrs }">
        <v-btn color="red darken-2" text v-bind="attrs" @click="editSnackbar=false">Tutup</v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="editPlaceDialog" dark width="1300">
      <v-card>
        <v-row no-gutters>
          <v-col>
            <v-card-title class="headline">Ubah Data Tempat</v-card-title>
            <v-card-text class="detailPlaceText">
              <v-text-field label="Nama tempat" v-model="detailPlace.name" />
              <v-textarea label="Deskripsi" v-model="detailPlace.desc" />
              <v-textarea label="Alamat" v-model="detailPlace.address" rows="3" />
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-text class="detailPlaceText mt-12">
              <v-text-field label="Latitude" v-model="detailPlace.latitude" />
              <v-text-field label="Longitude" v-model="detailPlace.longitude" />
              <v-text-field label="Biaya masuk / orang (Rp)" v-model="detailPlace.entryFee" />
              <v-textarea label="URL Gambar" v-model="detailPlace.image" />
            </v-card-text>
          </v-col>
          <v-col>
            <img :src="detailPlace.image" class="imagePlace" />
          </v-col>
        </v-row>
        
        <v-card-actions>
          <v-spacer />
          <v-btn @click="editPlace()" color="blue darken-2 mb-3">Ubah</v-btn>
          <v-spacer />
          <v-btn @click="editPlaceDialog=false" color="red darken-2 mb-3">Batal</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="editSnackbar" :timeout="timeout">
      Pengubahan berhasil!
      <template v-slot:action="{ attrs }">
        <v-btn color="red darken-2" text v-bind="attrs" @click="editSnackbar=false">Tutup</v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="deletePlaceDialog" dark width="500">
      <v-card>
        <v-card-title class="headline">Hapus Tempat</v-card-title>
        <v-card-text>
          <h3 class="text-center mt-8 mb-2">Apakah Anda yakin ingin menghapus tempat ini?</h3>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red darken-2 mb-3" @click="deletePlace()">Ya</v-btn>
          <v-spacer />
          <v-btn color="blue darken-2 mb-3" @click="deletePlaceDialog=false">Tidak</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="deleteSnackbar" :timeout="timeout">
      Penghapusan berhasil!
      <template v-slot:action="{ attrs }">
        <v-btn color="red darken-2" text v-bind="attrs" @click="deleteSnackbar=false">Tutup</v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script>
import AdminService from '@/services/AdminService'

export default {
  data() {
    return {
      headers: [
        { value: "icons", sortable: false, width: '5px' },
        { text: "Nama", value: "name", sortable: false, align: "center" },
        { text: "Latitude", value: "latitude", sortable: false, align: "center"},
        { text: "Longitude", value: "longitude", sortable: false, align: "center"},
        { text: "Biaya masuk / orang ", value: "entryFee", sortable: false, align: "center" },
        { value: "actions", sortable: false },
      ],
      places: [],
      tempResult: [],
      detailPlace: {
        placeId: null,
        name: null,
        desc: null,
        address: null,
        latitude: null,
        longitude: null,
        entryFee: null,
        image: null
      },
      searchEngine: null,
      timeout: 2000,
      addPlaceDialog: false,
      addSnackbar: false,
      editPlaceDialog: false,
      editSnackbar: false,
      deletePlaceDialog: false,
      deleteSnackbar: false,
      detailPlaceIndex: null
    }
  },
  async mounted() {
    this.places = (await AdminService.showPlaceList()).data
  },
  methods: {
    async addPlace () {
      await AdminService.addPlace({
        name: this.detailPlace.name,
        desc: this.detailPlace.desc,
        address: this.detailPlace.address,
        latitude: this.detailPlace.latitude,
        longitude: this.detailPlace.longitude,
        entryFee: this.detailPlace.entryFee,
        image: this.detailPlace.image
      })
      this.addPlaceDialog = false
      this.addSnackbar = true
      this.places = (await AdminService.showPlaceList()).data
    },
    openEditDialog(item) {
      this.detailPlace = item
      this.editPlaceDialog = true
    },
    async editPlace() {
      await AdminService.editPlace(this.detailPlace)
      this.editPlaceDialog = false
      this.editSnackbar = true
    },
    openDeleteDialog (item) {
      console.log(item)
      this.detailPlaceIndex = this.places.indexOf(item)
      this.detailPlace = item
      this.deletePlaceDialog = true
    },
    async deletePlace() {
      await AdminService.deletePlace({placeId: this.detailPlace.placeId})
      this.places.splice(this.detailPlaceIndex, 1)
      this.deletePlaceDialog = false
      this.deleteSnackbar = true
    },
    async searchPlaces(searchEngine) {
      this.tempResult.splice(0)
      AdminService.searchPlaces({searchEngine: searchEngine})
        .then(a => (this.tempResult.push(a.data), this.places = this.tempResult[0]))
    },
  }
}
</script>

<style>
.panel {
  background-color: #EEEEEE;
}

.closeBtn {
  margin-left: 350px;
}

.imagePlace {
  width: 400px;
  height: 280px;
  margin-top: 120px;
  margin-right: 50px;
}

.detailPlaceText {
  width: 350px;
}

.toolbarColor {
  /* C2FFD1 */
  background-color: #CEFFC2;
  color: #CEFFC2;
}

.shadow {
  background-color: white;
  box-shadow: 2px 0 6px 0 #BEEEC9;
}

.searchBar{
  width: 350px;
}

</style>