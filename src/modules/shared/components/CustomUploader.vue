<script setup lang="ts">
import { ref } from 'vue';

const dicc = {
  xlsx: {
    name: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.*|application/vnd.ms-excel',
    color: 'green',
  },
  xls: {
    name: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.*|application/vnd.ms-excel',
    color: 'green',
  },
  png: {
    name: 'png',
    color: 'amber',
  },
  jpg: {
    name: 'jpg',
    color: 'amber',
  },
  jpeg: {
    name: 'jpeg',
    color: 'amber',
  },
  webp: {
    name: 'webp',
    color: 'amber',
  },
  svg: {
    name: 'image/svg+xml',
    color: 'amber',
  },
  pdf: {
    name: 'application/pdf',
    color: 'red',
  },
};

type TypesExten = 'xlsx' | 'xls' | 'png' | 'pdf' | 'jpg' | 'jpeg' | 'webp' | 'svg';

interface Props {
  title: string;
  extensionSupport: TypesExten[];
  extensionMessage: string;
  icon: string;
  maxSizeInKB: number;
  previewImage?: boolean;
  initialPreviewUrl?: string | null;
}

interface Emits {
  (event: 'createFile', file: File): void;
  (event: 'rejected', message: string): void;
  (event: 'removeFile'): void;
}

const file = ref<File | null>(null);
const fileName = ref<string>('');
const fileType = ref<string>('');
const dragging = ref<boolean>(false);
const calculateSize = ref<number>(0);
const color = ref<string>('');
const extensionAccept = ref<string>('image/*');
const imagePreviewUrl = ref<string | null>(null);

const emits = defineEmits<Emits>();

const props = withDefaults(defineProps<Props>(), {
  title: 'Seleccione o arrastre el archivo',
  extensionMessage: 'Archivos permitidos: ',
  icon: '	sym_r_upload',
  initialPreviewUrl: null,
});

const fileExtensionAccept = () => {
  extensionAccept.value = props.extensionSupport.map((item) => '.' + item).join(', ');
};

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || !files.length) {
    dragging.value = false;
    return;
  }
  fileName.value = files[0]!.name;
  const extInNameArr = fileName.value.split('.');
  fileType.value = extInNameArr.slice(extInNameArr.length - 1)[0] as TypesExten;
  color.value = dicc[fileType.value as TypesExten].color;
  file.value = files[0]!;

  if (!props.extensionSupport.includes(fileType.value as TypesExten)) {
    clearState();
    dragging.value = false;
    emits('rejected', 'Por favor, seleccione un archivo: ' + props.extensionSupport.join(', '));
    return;
  }

  calculateSize.value = props.maxSizeInKB * 1024;
  if (files[0]!.size > calculateSize.value) {
    emits('rejected', `Por favor, el archivo no debe ser mayor a ${props.maxSizeInKB / 1024} MB`);
    clearState();
    dragging.value = false;
    return;
  }

  // Si es imagen y previewImage está activo, generar URL
  if (props.previewImage && ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(fileType.value)) {
    imagePreviewUrl.value = URL.createObjectURL(file.value);
  } else {
    imagePreviewUrl.value = null;
  }

  if (!file.value) return;
  emits('createFile', file.value);
  dragging.value = false;
};

const clearState = () => {
  file.value = null;
  fileName.value = '';
  fileType.value = '';
  color.value = '';
  imagePreviewUrl.value = null;
};

const removeFile = () => {
  emits('removeFile');
  clearState();
};

if (props.initialPreviewUrl) {
  imagePreviewUrl.value = props.initialPreviewUrl;
}

fileExtensionAccept();
</script>

<template>
  <div v-if="!file && !imagePreviewUrl">
    <div
      :class="['dropZone', dragging ? 'dropZone__over' : '']"
      @dragenter="dragging = true"
      @dragleave="dragging = false"
    >
      <div
        class="dropZone__info absolute full-width full-height flex column justify-center text-center"
        @drag="onChange"
      >
        <div class="text-center q-mb-md">
          <q-icon :name="icon" color="blue-grey-8" size="xl" />
        </div>
        <span class="dropZone__info--title">{{ title }}</span>
        <div class="flex column justify-start">
          <div>{{ extensionMessage + extensionSupport.join(', ') }}</div>
        </div>
      </div>
      <input
        class="full-width full-height cursor-pointer absolute"
        type="file"
        :accept="extensionAccept"
        @change="onChange"
      />
    </div>
  </div>
  <div v-else class="dropZone__uploaded full-width relative-position">
    <div
      class="dropZone__uploaded--info absolute flex column items-center full-width text-center q-pa-md"
    >
      <template v-if="props.previewImage && imagePreviewUrl">
        <q-img
          :src="imagePreviewUrl"
          alt="Vista previa"
          fit="contain"
          width="100%"
          height="120px"
        />
        <q-btn
          @click="removeFile"
          color="negative"
          label="Eliminar imagen"
          flat
          icon="sym_r_close"
          size="sm"
          class="q-mt-md"
          no-caps
        >
          <q-tooltip> Eliminar archivo </q-tooltip>
        </q-btn>
      </template>
      <template v-else>
        <q-card class="dropZone__uploaded--card full-width shadow-card">
          <q-card-section class="q-pa-none">
            <div class="flex items-center justify-end">
              <q-btn @click="removeFile" color="negative" flat round icon="sym_r_close" size="sm">
                <q-tooltip> Eliminar archivo </q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="flex column items-center justify-center">
              <div class="position-relative">
                <q-icon name="sym_r_description" color="blue-grey-5" size="xl" />
                <q-badge class="text-uppercase absolute dropZone__uploaded--badge" :color="color">{{
                  fileType
                }}</q-badge>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions class="q-px-md">
            <div class="col">
              <div class="text-subtitle2 text-dark ellipsis">{{ fileName }}</div>
            </div>
          </q-card-actions>
        </q-card>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropZone {
  width: 100%;
  height: 200px;
  position: relative;
  border: 2px dashed #d7d7d7;
  border-radius: 8px;

  &:hover {
    border: 2px dashed $primary;
  }

  &__uploaded {
    height: 200px;
    border: 2px dashed #eee;

    &--card {
      max-width: 250px;
    }

    &--info {
      color: #a8a8a8;
      top: 50%;
      transform: translate(0, -50%);
    }

    &--badge {
      bottom: 24px;
      right: 114px;
    }
  }

  &__info {
    color: #a8a8a8;
    top: 50%;
    transform: translate(0, -50%);

    &--title {
      color: #787878;
    }
  }

  & input {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
  }

  &__over {
    background: $blue-grey-1;
    opacity: 0.8;
  }
}
</style>
