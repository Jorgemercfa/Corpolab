import { ref } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

/**
 * Composable reutilizable para leer una colección de Firestore.
 * Los documentos se mapean con _docId = doc.id para usarlo en CRUD.
 */
export function useCollection(collectionName) {
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchItems() {
    loading.value = true;
    error.value = null;
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const docs = snapshot.docs.map((d) => ({ _docId: d.id, ...d.data() }));
      docs.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
      });
      items.value = docs;
    } catch (err) {
      console.error(`[Firestore] Error cargando "${collectionName}":`, err);
      error.value = err?.message || `No se pudieron cargar los datos de "${collectionName}".`;
    } finally {
      loading.value = false;
    }
  }

  return { items, loading, error, fetchItems };
}
