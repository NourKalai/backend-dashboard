export default function Checkbox(props){
    const {disabled, checked, onChange} = props;
    // make tailwind style for checkbox
    const style = "w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"

    return (
        <div className="p-0 m-0 flex items-center px-2">
            <input disabled={disabled} type="checkbox" checked={checked} onChange={onChange} className={style} />
        </div>
    );
}