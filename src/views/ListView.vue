<script>
import { useListStore } from '@/stores/list'
import { mapState, mapActions } from 'pinia'

import BaseInput from '@/components/BaseInput.vue'

const initialInput = {
  name: '',
  description: '',
  completed: false
}

export default {
  name: 'ListView',
  data: () => ({
    input: { ...initialInput },
    editing: false
  }),
  components: {
    BaseInput
  },
  computed: {
    // import all defined getters via mapState helper
    ...mapState(useListStore, ['getList', 'getDetail'])
  },
  methods: {
        // import all defined action via mapActions helper
        ...mapActions(useListStore, ['addList', 'editIndex', 'removeIndex']),
        // reset form
        resetForm() {
        // Reset Input with initial value
        Object.assign(this.input, initialInput)
        // reset editing state
        this.editing = false
        },

        // submit form
        addForm(event) {
        console.log(event)
        // pass input to action
        if (this.editing === false) {
            this.addList({ ...this.input })
        } else {
            this.editIndex(this.editing, { ...this.input })
        }
        this.resetForm()
        },
        detailList(index) {
        // set editing to true from index params
        this.editing = index
        // set input value from getters by index params
        this.input = { ...this.getDetail(index) }
    },
    
    // toggle completed
    toggleCompleted(index) {
      const detail = this.getDetail(index)
      this.editIndex(index, {
        ...detail,
        completed: !detail.completed
      })
    }
  }
}
</script>

<template>
  <div>
    <h1>List</h1>

    <form
      @submit.prevent="($event) => addForm($event)"
      method="post"
      @reset="() => resetForm()"
    >
      <!-- use component using kebab-case -->
      <base-input
        v-model="input.name"
        class="input"
        placeholder="Tambah Baru List"
        required
      ></base-input>
      <br />

      <base-input
        v-model="input.description"
        class="input"
        placeholder="Deskripsi List"
        required
      ></base-input>
      <br />

      <input v-model="input.completed" type="checkbox" /> Selesai
      <br />

      <button type="submit">{{ editing !== false ? 'Edit' : 'Add'}}</button>
      <button type="reset">Cancel</button>
    </form>

    <ol class="list">
        <template v-for="(item, index) in getList" :key="index">
        <li
          @dblclick="() => toggleCompleted(index)"
          :class="{ strike: item.completed }"
        >
            <!-- trigger delete by index -->
          <button
            class="red"
            @click="() => removeIndex(index)"
            :disabled="editing !== false"
          >
            &times;
          </button>
          <!-- trigger edit by index -->
          <button
            class="orange"
            @click="() => detailList(index)"
            :disabled="editing !== false"
          >
            &#9998;
          </button>
          {{ item.name }}
          {{ item?.description ? `- ${item.description}` : '' }}
        </li>
      </template>
    </ol>
  </div>
</template>

<style lang= "scss" scoped>
.list {
  margin-block: 0.5rem;
}

.strike {
  text-decoration: line-through;
}

button {
  &.red {
  color: red;
  }
  &.orange {
    color: orange;
  }
}

</style>

