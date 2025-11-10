import useNotify from 'src/modules/shared/composables/useNotify';
import { useProfile } from './useProfile';
import { useListOneProfile } from './useListOneProfile';
import { usePermission } from './usePermission';
import type { AxiosError } from 'axios';
import useDialog from 'src/modules/shared/composables/useDialog';

export const useProfileEvents = (onDialogOK?: () => void, onDialogCancel?: () => void) => {
  const { successNotify, errorNotify } = useNotify();

  const { profileDto, handleCreateProfile, handleUpdateProfile, handleDeleteProfile } =
    useProfile();
  const { profileItem } = useListOneProfile();
  const { permissionItem } = usePermission();
  const { confirmDialog } = useDialog();

  const resetForm = () => {
    profileDto.value = structuredClone({ name: '' });
    profileItem.value = structuredClone({ name: '' });
    permissionItem.value = structuredClone([]);
  };

  const handleSubmit = async (id?: number) => {
    if (id) await handleUpdate(id);
    else await handleCreate();
  };

  const handleUpdate = async (idP: number) => {
    try {
      await handleUpdateProfile(idP);
      resetForm();
      successNotify('Perfil Actualizado exitosamente');
      onDialogOK!();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error en handleUpdate:', error);
      errorNotify(axiosError.message || 'Error al actualizar perfil');
    }
  };

  const handleCreate = async () => {
    try {
      await handleCreateProfile();
      successNotify('Perfil creado exitosamente');
      onDialogOK!();
      resetForm();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error en handleCreate:', error);
      errorNotify(axiosError.message || 'Error al crear el perfil');
    }
  };

  const handleCancel = () => {
    resetForm();
    onDialogCancel!();
  };

  const handleDelete = async (idP: number) => {
    const isConfirm = await confirmDialog({
      message: '¿Confirma que desea eliminar este perfil?',
      title: 'Eliminar',
      colorOk: 'negative',
      colorCancel: 'primary',
      labelOK: 'Aceptar',
      labelCancel: 'Cancelar',
    });

    if (!isConfirm) return;

    try {
      await handleDeleteProfile(idP);
      successNotify('Perfil eliminado con éxito');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error en handleDelete:', error);
      errorNotify(axiosError.message || 'Error al eliminar el perfil');
    }
  };

  return { handleSubmit, handleCancel, handleDelete };
};
