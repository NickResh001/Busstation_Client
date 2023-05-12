import { useEffect } from 'react'
export let regionsList = [{}]

/**
 * Компонент react для обращения к акутулаьным данным таблицы регионов.
 */
const RegionList = () => {
    useEffect(() => {

        /**
         * Вызов GET-запроса в Swagger.
         */
        const getRegions = async () => {
            const requestOptions = {
                method: 'GET'
            }
            return await fetch("api/Region",

                requestOptions)

                .then(response => response.json())
                .then(
                    (data) => {
                        console.log('Data:', data)
                        regionsList = data
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        }
        getRegions()
    })
}
export default RegionList