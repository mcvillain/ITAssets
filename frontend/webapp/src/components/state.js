import { ref,computed,reactive} from 'vue' 

export const collapsed = ref(false)
export const toggleSidebar = ()=>  (collapsed.value = !collapsed.value)
export const SIDEBAR_WIDTH = 200
export const SIDEBAR_WIDTH_COLLAPSED = 90
export const sidebarWidth = computed(
    () => `${collapsed.value ? SIDEBAR_WIDTH_COLLAPSED:SIDEBAR_WIDTH}px`
)
const toggleDataTable = reactive({
  myString: 'server'
});
export default toggleDataTable;
