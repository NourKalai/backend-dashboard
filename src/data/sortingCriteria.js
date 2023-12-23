export const profileSoringCriteria = [
    { 
        label: 'Nom',
        value: 'lastname',
    }
    ,{
        label: 'Prénom',
        value: 'firstname',
    }
    ,{
        label: 'Date de naissance',
        value: 'dateBirth',
    },
    {
        label: 'Adresse',
        value: 'address'
    },
    {
        label:"Date d'ajout",
        value: 'date_added'
    }
]
export const sellerSortingCriteria = [
    ...profileSoringCriteria,
    {
        label: 'Gain total',
        value: 'totalEarnings',
    }
]

export const servicesSortingCriteria = [
    {
        label: 'Titre',
        value: 'title',
    },
    {
        label: 'Description',
        value: 'description',
    },
    {
        label: 'Prix',
        value: 'price',
    }
]

export const orderSortingCriteria = [
    {
        label:"Titre",
        value: 'title'
    },
    {
        label:"Description",
        value: 'description'
    },
    {
        label:"Total",
        value: 'total'
    },
    {
        label:"Date de livraison",
        value: 'deliveryDate'
    }
]