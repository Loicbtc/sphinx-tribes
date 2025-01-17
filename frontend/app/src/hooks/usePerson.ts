import { useStores } from 'store';
import { Person } from 'store/main';

export const usePerson = (id: any) => {
  const { main, ui } = useStores();
  const { meInfo } = ui || {};

  const person: Person | undefined = main.activePerson.length ? main.activePerson[0] : undefined;

  const canEdit = meInfo?.id === id;

  return {
    person: canEdit ? meInfo : person,
    canEdit
  };
};
