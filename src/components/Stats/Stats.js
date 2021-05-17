import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './Stats.css'

function Stats({ title, cases, total }) {
    return (
        <Card className='stats'>
            <CardContent>
                <Typography color='textSecondary'>
                    {title}
                </Typography>

                <h2 className='stats__cases'>{cases}</h2>
                
                <Typography>
                    {total}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Stats
