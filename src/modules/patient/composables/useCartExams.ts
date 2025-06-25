import { Exam } from "@/interfaces/exams";
import { computed, reactive } from "vue"

const cart = reactive({
    items:<Exam[]>[],
    total:0,
    isOpen:false,
})
export default function useCartExams(){

    const addItem = (item: any) => {
        const idx = cart.items.findIndex(i => i.id === item.id);
        if(idx === -1){
            
            cart.items.push({
                ...item,
                cart_quantity: 1
            });
        }else{
            cart.items[idx].cart_quantity++ 
        }
        
        cart.total = getTotal();
    };

    const updateItem = (data:any) => {
        Object.assign(cart.items[data.index], { ...data });
        cart.total = getTotal();
    };

    const removeItem = (index: number) => {
        
        if(cart.items[index].cart_quantity > 1){
            cart.items[index].cart_quantity--
        }else{
            cart.items.splice(index, 1);
        }

        cart.total = getTotal();
    };

    const getSubTotal = () =>{
        return cart.items.reduce(function (a, b) {
            return a + (b['price'] * b['cart_quantity']);
        }, 0);
    };

    const getTotal = () => {
        return getSubTotal();
    };

    return{
        cart: computed(()=> cart),
        addItem,
        updateItem,
        removeItem,
        getTotal
    }
}