import { ClassCadeMaterial, Assessment, ClassCade } from '@/lib/utils';

const Material = ({ ClassCadeMaterialState, Assessment }: { ClassCadeMaterialState: ClassCadeMaterial[] | null, Assessment: Assessment[] | null }) => {
    const combinedData = [
        ...(ClassCadeMaterialState || []),
        ...(Assessment || [])
    ].sort((a, b) => {
        return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
    });

    return combinedData.length > 0 ? (
        <div>
            {combinedData.map((item) => { 
                const isAssessment = 'assessment_type' in item;
                return (
                <div key={item.id}>
                    <h3>{isAssessment? "Assessment":"Material" }</h3>
                    <h4>{item.title}</h4>
                    <h6>{item.date_created}</h6>
                    <p>{item.description}</p>
                    {item.links && <p>{item.links}</p>}
                </div>
            )})}
        </div>
    ) : (
        <div>
            <h4>No material or assessment</h4>
        </div>
    );
};

export default Material;