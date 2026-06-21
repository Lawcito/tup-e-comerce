import i18next from 'i18next';

i18next.init({
  lng: 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    es: {
      translation: {
        common: {
          user: 'Usuario',
        },
        login: {
          title: 'Clock Nails',
          subtitle: 'Ingresá para continuar',
          button: 'Iniciar sesión',
          logoAlt: 'Logo de Clock Nails',
        },
        navigation: {
          items: 'Items',
          settings: 'Configuración',
          logout: 'Cerrar sesión',
          exit: 'Salir',
        },
        items: {
          title: 'Productos',
          searchPlaceholder: 'Buscar por nombre, marca, descripción o categoría',
          sortByName: 'Ordenar por nombre',
          sortByBrand: 'Ordenar por marca',
          sortByPriceAsc: 'Menor precio',
          sortByPriceDesc: 'Mayor precio',
          minPrice: 'Desde.',
          maxPrice: 'Hasta.',
          sortByRating: 'Ordenar por puntaje',
          sortByCategory: 'Ordenar por categoría',
          sortByType: 'Ordenar por tipo',
          loading: 'Cargando productos...',
          error: 'No pudimos cargar los productos. Intentá nuevamente más tarde.',
          empty: 'No se encontraron productos.',
          noBrand: 'Sin marca',
          noDescription: 'Sin descripción disponible.',
          price: 'Precio',
          rating: 'Puntaje',
          noRating: 'Sin puntaje',
          noCategory: 'Sin categoría',
        },
        settings: {
          title: 'Configuración',
          account: 'Mi cuenta',
          session: 'Sesión',
        },
        logoutDialog: {
          title: '¿Cerrar sesión?',
          message: '¿Estás seguro de que querés salir de tu cuenta?',
          cancel: 'Cancelar',
          confirm: 'Cerrar sesión',
        },
      },
    },
  },
});

export default i18next;
