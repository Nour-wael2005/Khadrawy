# =====================================================
# KHADRWY - AGRICULTURAL KNOWLEDGE BASE
# =====================================================
#
# Curated agricultural knowledge for Khadrwy AI.
#
# IMPORTANT:
# - This is a manually curated knowledge base.
# - It is NOT an OCR extraction of the FAO PDFs.
# - No unsupported pesticide names, chemical doses,
#   fertilizer rates, or treatment schedules are included.
# - The RAG generator should only answer from supported
#   information.
#
# Main knowledge areas:
# - Plant health
# - Cultivation
# - Greenhouse management
# - Monitoring
# - Sensors
# - Early stress detection
# - Irrigation
# - Soil
# - Nutrition
# - Diseases
# - Pests
# - Seeds and seedlings
# - Harvest and post-harvest
# - Crop-specific guidance
# =====================================================


# =====================================================
# KNOWLEDGE DOCUMENTS
# =====================================================

documents = [

    # =================================================
    # 1. GENERAL PLANT HEALTH
    # =================================================

    {
        "title": "Healthy Plant Care",
        "plant": "General",
        "condition": "Healthy",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Healthy plant growth depends on balanced environmental and
management conditions. Important factors include suitable
light, appropriate temperature, adequate water, suitable
soil or growing medium, sufficient nutrition, good air
circulation, and regular monitoring.

Plants should be observed regularly for changes in leaf
color, leaf shape, growth rate, wilting, spots, pest activity,
and changes in soil moisture.

Early observation helps identify problems before they become
severe.
"""
    },

    {
        "title": "General Plant Stress Assessment",
        "plant": "General",
        "condition": "Plant Stress",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant stress can result from unsuitable water availability,
temperature conditions, humidity, light, soil conditions,
nutrition, pests, diseases, or physical damage.

Stress assessment should consider the whole growing
environment rather than relying on one symptom.

Useful observations include leaf color, wilting, growth rate,
new growth, root condition when visible, soil moisture,
temperature, humidity, light, and recent management changes.
"""
    },

    {
        "title": "Plant Problem Diagnosis Principles",
        "plant": "General",
        "condition": "Plant Problem",
        "category": "diagnosis",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant diagnosis should consider symptoms together with
environmental and management information.

Important observations include where symptoms appear, whether
they affect old or new leaves, whether symptoms are spreading,
soil moisture, recent irrigation, temperature, humidity,
light, nutrition, pest presence, and cultivation practices.

A single symptom does not always identify one specific cause.
Different problems can produce similar visible symptoms.
"""
    },

    {
        "title": "Integrated Plant Health Management",
        "plant": "General",
        "condition": "Plant Health",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Integrated plant health management combines environmental
management, irrigation management, soil care, nutrition,
sanitation, pest monitoring, disease observation, and regular
record keeping.

The goal is to maintain suitable growing conditions and
detect problems early rather than relying only on treatment
after severe symptoms appear.
"""
    },


    # =================================================
    # 2. MONITORING
    # =================================================

    {
        "title": "General Plant Monitoring",
        "plant": "General",
        "condition": "Monitoring",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant monitoring means regularly observing and recording
environmental conditions and plant condition over time.

Useful monitoring information can include temperature,
relative humidity, soil or growing-medium moisture, light,
irrigation events, plant growth, leaf condition, pest activity,
and disease symptoms.

Monitoring is more useful when observations are recorded
consistently so that changes and trends can be identified.
"""
    },

    {
        "title": "Plant Growth Monitoring",
        "plant": "General",
        "condition": "Growth",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant growth monitoring involves observing changes in plant
size, new leaves, branching, flowering, fruit development,
overall vigor, and visible stress.

Repeated observations are more useful than a single
observation because they allow changes in growth patterns to
be noticed.

Unexpected slowing of growth, abnormal new growth, repeated
wilting, or progressive leaf changes should trigger closer
inspection of environmental and management conditions.
"""
    },

    {
        "title": "Plant Symptom Monitoring",
        "plant": "General",
        "condition": "Symptoms",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant symptom monitoring includes regular observation of
yellowing, browning, spots, wilting, curling, unusual growth,
leaf damage, and changes in plant vigor.

The location and progression of symptoms should be recorded.
It is useful to note whether symptoms affect older leaves,
new leaves, isolated plants, or many plants.

Changes over time can provide useful evidence when assessing
plant health.
"""
    },

    {
        "title": "Environmental Trend Monitoring",
        "plant": "General",
        "condition": "Environmental Stress",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Environmental monitoring should focus not only on individual
measurements but also on changes over time.

Repeated measurements of temperature, humidity, soil moisture,
and light can help identify changing environmental conditions.

A sudden or persistent change should be considered together
with plant observations and recent management activities.

Environmental data alone does not automatically establish
the cause of a plant disease.
"""
    },

    {
        "title": "Early Plant Stress Detection",
        "plant": "General",
        "condition": "Early Stress",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Early plant stress detection depends on noticing changes
before severe damage develops.

Useful warning signs include changes in leaf color, repeated
wilting, reduced growth, unusual new growth, changes in soil
moisture, persistent environmental changes, increasing pest
activity, and the appearance or spread of leaf symptoms.

Early warning should be based on multiple observations rather
than one measurement or one symptom.
"""
    },

    {
        "title": "Early Warning for Plant Problems",
        "plant": "General",
        "condition": "Early Warning",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
An early warning approach compares current plant and
environmental observations with previous observations.

Useful warning signals include persistent changes in soil
moisture, unusual temperature or humidity patterns, declining
plant growth, increasing pest observations, or progressive
leaf symptoms.

The purpose of early warning is to trigger closer inspection
and investigation. It does not by itself confirm a disease or
specific cause.
"""
    },

    {
        "title": "Greenhouse Monitoring Workflow",
        "plant": "General",
        "condition": "Greenhouse Monitoring",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
A practical greenhouse monitoring workflow can include:

1. Record temperature and relative humidity.
2. Monitor soil or growing-medium moisture.
3. Observe light conditions.
4. Record irrigation and important management events.
5. Observe plant growth and leaf condition.
6. Check for pests and disease symptoms.
7. Compare observations with previous records.
8. Investigate unusual changes.
9. Continue monitoring after management changes.

Monitoring should support decision making rather than replace
plant inspection.
"""
    },

    {
        "title": "Monitoring vs Diagnosis",
        "plant": "General",
        "condition": "Monitoring and Diagnosis",
        "category": "diagnosis",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Monitoring is the repeated observation and recording of plant
and environmental conditions.

Diagnosis is the process of determining the most likely cause
of a plant problem using symptoms, environmental conditions,
management history, and other available evidence.

Monitoring can provide evidence for diagnosis, but monitoring
alone does not necessarily confirm a disease or specific cause.
"""
    },

    {
        "title": "Agricultural Record Keeping",
        "plant": "General",
        "condition": "Record Keeping",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Agricultural records help identify patterns and changes over
time.

Useful records can include environmental measurements,
irrigation events, nutrition activities, planting information,
growth observations, pest observations, disease symptoms, and
management actions.

Consistent records make it easier to compare conditions before
and after a problem appears or a management action is taken.
"""
    },


    # =================================================
    # 3. SENSOR-BASED MONITORING
    # =================================================

    {
        "title": "Sensor-Based Plant Monitoring",
        "plant": "General",
        "condition": "Sensor Monitoring",
        "category": "sensors",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Sensors can support continuous monitoring of environmental
conditions around plants.

Common monitoring variables include temperature, relative
humidity, soil or substrate moisture, and light intensity.

Sensor readings should be interpreted together with plant
observations and management records. A sensor measurement
alone does not prove that a plant has a disease.
"""
    },

    {
        "title": "Temperature and Humidity Monitoring",
        "plant": "General",
        "condition": "Temperature and Humidity",
        "category": "sensors",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Temperature and relative humidity are important environmental
variables for greenhouse plant management.

Continuous or repeated measurements can help identify changes
in the growing environment.

Temperature and humidity should be considered together with
ventilation, crop requirements, irrigation, plant density,
and observed plant condition.

Measurements should be recorded over time so persistent or
unusual changes can be recognized.
"""
    },

    {
        "title": "Soil Moisture Monitoring",
        "plant": "General",
        "condition": "Soil Moisture",
        "category": "sensors",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Soil or growing-medium moisture monitoring provides information
about the water condition around plant roots.

Repeated soil moisture observations can help identify patterns
such as persistently wet conditions or rapid drying.

Soil moisture should be interpreted together with plant
condition, soil drainage, temperature, humidity, crop needs,
and recent irrigation.

A moisture reading by itself does not determine whether a plant
has a disease.
"""
    },

    {
        "title": "Light Monitoring for Plants",
        "plant": "General",
        "condition": "Light",
        "category": "sensors",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Light is an important environmental factor for plant growth.

Light monitoring can help identify changes in the growing
environment and should be considered together with plant growth,
leaf development, and the crop's environmental requirements.

Sudden changes in light conditions should be recorded and
compared with plant responses.
"""
    },

    {
        "title": "Sensor Data Interpretation",
        "plant": "General",
        "condition": "Sensor Data",
        "category": "sensors",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Sensor data should be interpreted as measurements of the
environment rather than direct diagnoses of plant health.

Useful interpretation considers:

- current reading
- previous readings
- duration of the change
- relationship between variables
- plant observations
- irrigation and management history

For example, soil moisture information becomes more useful
when considered together with irrigation history and plant
condition.

Sensor data should support investigation and decision making,
not replace diagnosis.
"""
    },

    {
        "title": "Sensor Trend Analysis",
        "plant": "General",
        "condition": "Sensor Trends",
        "category": "sensors",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Sensor trend analysis involves comparing repeated readings over
time instead of relying on one measurement.

Important observations include persistent increases, decreases,
repeated fluctuations, and unusual changes.

Trend information can be compared with irrigation events,
ventilation changes, weather conditions, and plant symptoms.

A trend can indicate that closer inspection is needed, but it
does not automatically identify the biological cause.
"""
    },


    # =================================================
    # 4. GREENHOUSE
    # =================================================

    {
        "title": "Greenhouse Plant Management",
        "plant": "General",
        "condition": "Greenhouse Management",
        "category": "greenhouse",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Greenhouse management requires coordinated attention to
temperature, humidity, ventilation, light, irrigation,
nutrition, plant density, sanitation, and crop requirements.

The goal is to maintain a suitable growing environment and
reduce conditions that favor plant stress, pests, and diseases.

Management decisions should consider the crop and current
environment rather than using one fixed practice for every
plant.
"""
    },

    {
        "title": "Greenhouse Environmental Monitoring",
        "plant": "General",
        "condition": "Greenhouse Environment",
        "category": "greenhouse",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Greenhouse environmental monitoring should include relevant
conditions such as temperature, relative humidity, ventilation,
light, irrigation, and plant condition.

Monitoring several factors together is important because plant
responses can be influenced by interactions between environmental
conditions.

Regular monitoring can help identify changes that require
closer investigation.
"""
    },

    {
        "title": "Greenhouse Ventilation",
        "plant": "General",
        "condition": "Ventilation",
        "category": "greenhouse",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Proper greenhouse ventilation supports environmental management
and air movement around plants.

Ventilation should be coordinated with temperature, outside
weather conditions, crop requirements, greenhouse design, and
humidity management.

Poor air movement can contribute to an unsuitable growing
environment and may increase conditions favorable to some
plant health problems.
"""
    },

    {
        "title": "Greenhouse Plant Density",
        "plant": "General",
        "condition": "Plant Density",
        "category": "greenhouse",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant density affects air movement, light distribution, and
the accessibility of plants for monitoring.

Very dense plant growth can make inspection more difficult and
can reduce air circulation around plant parts.

Plant density should be considered as part of greenhouse
management together with crop requirements and available space.
"""
    },

    {
        "title": "Protected Cultivation Principles",
        "plant": "General",
        "condition": "Protected Cultivation",
        "category": "greenhouse",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Protected cultivation allows environmental conditions to be
managed more closely than in open-field production.

Important management areas include environmental monitoring,
ventilation, irrigation, crop nutrition, sanitation, plant
density, pest monitoring, and disease observation.

Successful protected cultivation depends on maintaining
appropriate conditions for the crop and responding to changes
in the growing environment.
"""
    },


    # =================================================
    # 5. IRRIGATION AND WATER
    # =================================================

    {
        "title": "Plant Irrigation",
        "plant": "General",
        "condition": "Water Management",
        "category": "irrigation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Irrigation should provide plants with appropriate water while
avoiding prolonged excessive moisture.

Water management should consider crop requirements, soil or
growing-medium properties, drainage, environmental conditions,
plant growth stage, and recent moisture observations.

Irrigation decisions should not be based only on a fixed
calendar schedule.
"""
    },

    {
        "title": "Soil Moisture Management",
        "plant": "General",
        "condition": "Soil Moisture",
        "category": "irrigation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Good soil moisture management aims to avoid both prolonged
excess moisture and inadequate water availability.

Soil moisture should be considered together with drainage,
temperature, humidity, plant size, crop requirements, and
recent irrigation.

Repeated observations can help identify whether soil is
remaining wet for too long or drying faster than expected.
"""
    },

    {
        "title": "Plant Overwatering",
        "plant": "General",
        "condition": "Overwatering",
        "category": "irrigation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Excessive or overly frequent irrigation can keep the root
environment wet for prolonged periods.

Overwatering should be considered when plants show poor growth
or other stress symptoms while the growing medium remains
persistently wet.

Assessment should also consider drainage, soil structure,
temperature, humidity, and root condition when available.
"""
    },

    {
        "title": "Plant Underwatering",
        "plant": "General",
        "condition": "Underwatering",
        "category": "irrigation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Insufficient water availability can lead to water stress and
wilting.

Assessment should consider soil moisture, recent irrigation,
temperature, humidity, plant size, and growing conditions.

Wilting alone does not prove that underwatering is the cause,
because other stresses can produce similar symptoms.
"""
    },

    {
        "title": "Soil Drainage",
        "plant": "General",
        "condition": "Drainage",
        "category": "soil",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Good drainage helps prevent prolonged water accumulation around
plant roots.

Poor drainage can keep the root environment excessively wet and
can contribute to poor plant performance.

Drainage should be evaluated together with soil structure,
irrigation practices, container design, and soil moisture
observations.
"""
    },


    # =================================================
    # 6. SOIL
    # =================================================

    {
        "title": "Soil for Plant Growth",
        "plant": "General",
        "condition": "Soil",
        "category": "soil",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
A suitable growing soil should provide support, water
availability, air around the roots, and access to nutrients.

Important soil properties include structure, drainage,
water-holding behavior, organic matter, compaction, and pH.

Soil conditions should be considered when diagnosing poor
growth or irregular plant development.
"""
    },

    {
        "title": "Soil Preparation",
        "plant": "General",
        "condition": "Soil Preparation",
        "category": "soil",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Soil preparation should aim to create a suitable root
environment with good structure and drainage.

Preparation can include removing unsuitable material,
improving soil structure, addressing compaction, and ensuring
appropriate drainage.

The final growing medium should support healthy root
development and water management.
"""
    },

    {
        "title": "Soil pH",
        "plant": "General",
        "condition": "Soil pH",
        "category": "soil",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Soil pH influences nutrient availability and plant growth.

Unexpected nutrient-related symptoms should be considered
together with soil pH, soil condition, irrigation, and plant
requirements.

Specific ideal pH values should be based on the requirements
of the crop rather than assuming one value is appropriate for
all plants.
"""
    },

    {
        "title": "Soil Compaction",
        "plant": "General",
        "condition": "Soil Compaction",
        "category": "soil",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Soil compaction can reduce pore space and affect water movement
and root development.

Compacted soil may influence drainage and root access to water
and air.

Poor growth associated with compaction should be evaluated
together with irrigation and soil moisture conditions.
"""
    },


    # =================================================
    # 7. PLANT NUTRITION
    # =================================================

    {
        "title": "Plant Nutrition",
        "plant": "General",
        "condition": "Nutrition",
        "category": "nutrition",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plants require appropriate nutrients for growth and development.

Nutrition should be managed according to crop requirements,
soil or growing-medium conditions, plant growth stage, and
available evidence of deficiency or excess.

Nutrient problems should not be diagnosed from one symptom
alone because environmental stress and disease can produce
similar visible changes.
"""
    },

    {
        "title": "General Fertilization Principles",
        "plant": "General",
        "condition": "Fertilization",
        "category": "nutrition",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Fertilization should match the crop, growth stage, growing medium, and evidence about nutrient availability. Before adding fertilizer, review plant symptoms, irrigation practices, drainage, and any available soil or growing-medium test. Nutrient deficiency, excess salts, root damage, water stress, and disease can produce overlapping symptoms, so leaf color alone is not enough to select a fertilizer. Apply only products and rates supported by reliable crop-specific guidance and the product label. Record the product, amount, date, and plant response so later decisions can be evaluated. Avoid repeated applications made without checking whether the original problem was correctly identified."""
    },

    {
        "title": "Nutrient Deficiency Assessment",
        "plant": "General",
        "condition": "Nutrient Deficiency",
        "category": "nutrition",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Nutrient deficiency assessment should consider the location of
symptoms on the plant, leaf age, growth pattern, soil condition,
pH, irrigation, and other environmental stresses.

Leaf yellowing or poor growth does not automatically prove a
nutrient deficiency.

Additional evidence may be needed before choosing a corrective
action.
"""
    },


    # =================================================
    # 8. DISEASES
    # =================================================

    {
        "title": "General Leaf Spot",
        "plant": "General",
        "condition": "Leaf Spot",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Leaf spots are visible changes that can have different causes,
including diseases and environmental or physiological problems.

Assessment should consider spot appearance, location,
progression, affected plant parts, humidity, irrigation,
air circulation, and other symptoms.

Leaf spots should not automatically be attributed to one
specific disease without sufficient evidence.
"""
    },

    {
        "title": "Plant Disease Prevention",
        "plant": "General",
        "condition": "Disease Prevention",
        "category": "disease_prevention",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Plant disease prevention combines clean planting material, regular inspection, sanitation, appropriate spacing, balanced irrigation, and management of temperature and humidity. Remove or isolate affected material when appropriate, and clean tools between plants if contamination may be transferred mechanically. Avoid keeping foliage wet for unnecessarily long periods and maintain airflow suited to the crop. Inspect new plants before introducing them to an existing growing area. Record when symptoms first appear, which plants are affected, and whether the problem is spreading. These practices reduce avoidable disease pressure but cannot guarantee that disease will not occur; suspected outbreaks may require confirmation by a qualified agricultural specialist."""
    },

    {
        "title": "Agricultural Sanitation",
        "plant": "General",
        "condition": "Sanitation",
        "category": "disease_prevention",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Good agricultural sanitation can reduce sources of plant
health problems.

Useful practices include removing severely affected plant
material when appropriate, keeping growing areas clean,
monitoring new planting material, and avoiding unnecessary
spread of contaminated material.

Sanitation should be part of a broader plant health management
program.
"""
    },

    {
        "title": "General Root Rot",
        "plant": "General",
        "condition": "Root Rot",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Root problems can be associated with prolonged excessive
moisture and unsuitable root-zone conditions.

Symptoms may include poor growth and wilting despite adequate
or excessive water availability.

Assessment should consider drainage, irrigation, soil moisture,
and root condition when roots can be inspected.
"""
    },

    {
        "title": "General Plant Wilting",
        "plant": "General",
        "condition": "Wilting",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Wilting indicates plant water stress or another plant health
problem but does not identify a single cause.

Possible factors to investigate include soil moisture,
irrigation, root condition, temperature, humidity, pests,
disease, and plant stress.

The surrounding environmental conditions should be reviewed
before deciding on a cause.
"""
    },

    {
        "title": "Plant Leaf Yellowing",
        "plant": "General",
        "condition": "Yellow Leaves",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Leaf yellowing can have multiple causes, including nutrition,
water management, root problems, environmental stress, or
disease.

Assessment should consider which leaves are affected, whether
yellowing is spreading, soil moisture, drainage, nutrition,
light, temperature, and other symptoms.

Yellowing alone should not be treated as proof of one specific
problem.
"""
    },


    # =================================================
    # 9. PEST MONITORING
    # =================================================

    {
        "title": "Plant Pest Monitoring",
        "plant": "General",
        "condition": "Pests",
        "category": "pest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Pest monitoring involves regular inspection of leaves, stems,
new growth, and other plant parts.

Useful observations include the presence of insects, feeding
damage, sticky residues, discoloration, and changes in plant
growth.

Monitoring helps detect pest populations early and supports
timely investigation.
"""
    },

    {
        "title": "Aphid Monitoring",
        "plant": "General",
        "condition": "Aphids",
        "category": "pest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Aphids are small sap-feeding insects often found in colonies on tender shoots, buds, and the undersides of young leaves. Look for live insects, curled or distorted new growth, sticky honeydew, and sometimes ants visiting affected plants. Check several plants and locations rather than judging the whole crop from one leaf. Record the crop, affected plant parts, approximate abundance, and whether numbers are increasing between inspections. Some symptoms resemble other pest or environmental problems, so confirm that insects are present before deciding on management. Preserve beneficial insects where possible and use an integrated pest-management approach appropriate to the crop and local recommendations."""
    },

    {
        "title": "Whitefly Monitoring",
        "plant": "General",
        "condition": "Whiteflies",
        "category": "pest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Whiteflies are small, pale insects commonly found on the undersides of leaves; adults may fly up when foliage is disturbed. Inspect the lower leaf surfaces and compare multiple plants, including new growth and areas where plants are crowded. Record adult presence, immature stages when visible, leaf yellowing, sticky honeydew, and changes in population over time. Yellowing alone does not confirm whiteflies because nutrition, water stress, and disease can cause similar symptoms. Monitoring should establish whether the pest is present and whether its abundance is increasing before management is selected. Use crop-specific integrated pest-management guidance and avoid relying on a single observation."""
    },

    {
        "title": "Thrips Monitoring",
        "plant": "General",
        "condition": "Thrips",
        "category": "pest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Thrips are tiny, slender insects that feed on plant tissues and may be difficult to see without close inspection. Examine young leaves, flowers, buds, and developing fruit where relevant. Possible signs include silvery or bronze scarring, tiny dark specks of frass, distorted growth, and visible narrow-bodied insects. These signs are not conclusive by themselves, so inspect affected tissues carefully and compare them with healthy areas. Sample several plants and record the plant part, location, visible insects, and whether damage is spreading. Use crop-appropriate monitoring methods and integrated pest-management advice; do not choose a treatment solely from leaf damage without confirming the likely cause."""
    },

    {
        "title": "Spider Mite Monitoring",
        "plant": "General",
        "condition": "Spider Mites",
        "category": "pest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Spider mites are very small pests that often feed on leaf surfaces and may cause fine pale stippling, bronzing, or, in heavier infestations, fine webbing. Inspect both sides of leaves, especially in warm, dry or dusty conditions, and use a hand lens when available. Check several plants because early infestations may be localized. Record the location of damage, presence of mites or webbing, and changes between inspections. Similar leaf stippling can have other causes, so confirm pest evidence before selecting management. Avoid assuming that all webbing is caused by spider mites, and consult crop-specific integrated pest-management guidance when populations or damage are increasing."""
    },


    # =================================================
    # 10. SEEDS AND SEEDLINGS
    # =================================================

    {
        "title": "Seed Selection",
        "plant": "General",
        "condition": "Seeds",
        "category": "seeds",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Choose seed that is correctly identified for the intended crop and variety, suited to the local climate and production system, and obtained from a reputable supplier. Check the package label, lot information, expiry or test date where provided, and any stated germination or treatment information. Avoid seed that is visibly damaged, moldy, or stored in damp conditions. Variety choice should also consider the growing season, available water, market or household purpose, and known local disease pressures. Keep seed dry and protected according to supplier instructions. When germination performance is uncertain, test a small sample before sowing a large area and record the result."""
    },

    {
        "title": "Seed Germination",
        "plant": "General",
        "condition": "Germination",
        "category": "seeds",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Seed germination depends on viable seed and suitable moisture, temperature, oxygen, and, for some species, light or darkness conditions. Keep the growing medium evenly appropriate for the crop rather than waterlogged; saturated media can limit oxygen and encourage seed decay, while drying can interrupt germination. Follow crop- and supplier-specific sowing depth and temperature guidance instead of applying one rule to every species. Label sowing dates and varieties, then record emergence and uneven areas. If germination is poor, check seed age and storage, sowing depth, moisture, temperature, and media condition before resowing. Different seeds naturally emerge at different rates."""
    },

    {
        "title": "Vegetable Seedling Management",
        "plant": "General",
        "condition": "Seedlings",
        "category": "seedlings",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Healthy vegetable seedlings need suitable light, temperature, moisture, airflow, and a clean growing medium. Inspect stems, leaves, and roots for weak or stretched growth, discoloration, wilting, damping-off-like collapse, pests, and uneven development. Water according to the medium and seedling condition, allowing appropriate drainage rather than keeping trays continuously saturated. Provide enough light to reduce excessive stretching and avoid sudden environmental changes. Separate visibly diseased seedlings when appropriate and keep trays and tools clean. Before transplanting, ensure seedlings are sufficiently established and acclimated to the destination environment. Crop-specific guidance should determine timing, spacing, and nutrition."""
    },

    {
        "title": "Seedling Transplanting",
        "plant": "General",
        "condition": "Transplanting",
        "category": "seedlings",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Transplant seedlings when they are sufficiently established for the crop and the receiving environment is suitable. Handle seedlings gently and minimize damage to roots and stems; follow crop-specific advice on root-ball handling and planting depth. Prepare the planting area in advance and ensure soil or growing medium has suitable moisture and drainage. After transplanting, monitor wilting, leaf condition, soil moisture, and recovery over the following days. Temporary stress can occur, but persistent decline may indicate root damage, unsuitable conditions, water imbalance, or disease. Avoid compensating automatically with excessive irrigation or fertilizer; investigate the conditions and follow locally appropriate crop guidance."""
    },


    # =================================================
    # 11. GENERAL CULTIVATION
    # =================================================

    {
        "title": "General Plant Cultivation Guide",
        "plant": "General",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
General crop cultivation includes selecting suitable planting
material, preparing the growing environment, establishing
plants, managing water and nutrition, monitoring environmental
conditions, controlling weeds and pests, observing diseases,
and harvesting at an appropriate stage.

Specific practices should be adapted to the crop and growing
environment.
"""
    },

    {
        "title": "Plant Spacing",
        "plant": "General",
        "condition": "Plant Spacing",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Plant spacing affects light interception, airflow, root competition, access for inspection, and the amount of space available for crop development. Suitable spacing varies with species, variety, expected plant size, production method, and whether plants are grown in open fields, beds, containers, or protected structures. Crowding can increase humidity around foliage and make pest or disease monitoring difficult, while excessive spacing may use production area inefficiently. Follow reliable crop-specific spacing recommendations and account for access paths and equipment. If a crop is already crowded, avoid damaging roots or stems when adjusting it; use the observation to improve layout in future plantings."""
    },

    {
        "title": "General Weed Management",
        "plant": "General",
        "condition": "Weeds",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Weeds compete with crops for light, water, nutrients, and growing space, and some may host pests or pathogens. Inspect the crop area regularly and identify weeds before choosing a management method, because species and growth stage affect the appropriate approach. Consider the crop, production system, labor, soil disturbance, and risk of damaging crop roots. Preventing weeds from setting seed can reduce future pressure. Keep records of where weeds occur and whether the same areas repeatedly become infested. Use locally approved, crop-appropriate practices and follow product labels if herbicides are used. Avoid assuming that one weed-control method is suitable for every crop or site."""
    },

    {
        "title": "Crop Monitoring",
        "plant": "General",
        "condition": "Crop Monitoring",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Crop monitoring is a repeated process of checking plant growth, leaves, stems, roots when accessible, pests, disease symptoms, soil moisture, and environmental conditions. Establish a consistent route or sampling method so observations from different dates can be compared. Record the date, crop and growth stage, location, affected plant parts, sensor readings, recent irrigation or management, and photographs where useful. Look for changes and patterns rather than reacting to one unusual plant or one sensor value. Monitoring can reveal where further inspection is needed, but it does not automatically confirm a diagnosis. Use the evidence to decide whether to observe again, test further, or seek expert advice."""
    },


    # =================================================
    # 12. TOMATO
    # =================================================

    {
        "title": "Tomato Cultivation Guide",
        "plant": "Tomato",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Tomato production requires suitable light, soil or growing
medium, water management, nutrition, temperature, air
circulation, and regular monitoring.

Healthy seedlings should be established in a suitable growing
environment.

During growth, plants should be monitored for water stress,
nutritional problems, pests, diseases, flowering, and fruit
development.

Tomato cultivation can be carried out in open fields,
containers, or protected environments, but management should
be adapted to the production system.
"""
    },

    {
        "title": "Tomato Flowering and Fruit Development",
        "plant": "Tomato",
        "condition": "Flowering and Fruit Development",
        "category": "growth",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Tomato flowering and fruit development are important stages
that should be monitored carefully.

Environmental conditions, plant nutrition, water management,
and overall plant health can influence flowering and fruit
development.

Monitoring should include flower formation, fruit development,
plant vigor, and any environmental changes occurring during
these stages.
"""
    },

    {
        "title": "Tomato Early Blight",
        "plant": "Tomato",
        "condition": "Early Blight",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Tomato early blight can produce leaf symptoms and may affect
plant vigor.

Diagnosis should consider the appearance and progression of
leaf symptoms together with environmental conditions and other
evidence.

Good monitoring, sanitation, suitable air circulation, and
careful irrigation management are important components of plant
health management.
"""
    },

    {
        "title": "Tomato Late Blight",
        "plant": "Tomato",
        "condition": "Late Blight",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Tomato late blight is a serious disease associated with the oomycete Phytophthora infestans. Symptoms may include rapidly expanding, water-soaked-looking dark lesions on leaves and stems; under humid conditions, pale growth may appear near lesion margins, and fruit can develop firm brown lesions. Appearance varies with weather and disease stage, and other disorders can resemble these symptoms. Inspect both leaf surfaces, stems, and fruit, and record how quickly lesions expand and whether nearby plants are affected. Do not diagnose from one spot or image alone. If late blight is suspected, seek prompt local agricultural guidance, avoid moving potentially infected plant material, and follow locally approved disease-management recommendations."""
    },

    {
        "title": "Tomato Yellow Leaves",
        "plant": "Tomato",
        "condition": "Yellow Leaves",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Yellow leaves in tomato plants can have multiple causes.

Possible factors to investigate include water management,
drainage, nutrition, environmental stress, root problems, and
disease.

The location and age of affected leaves should be observed,
along with soil moisture and recent management.
"""
    },

    {
        "title": "Tomato Wilting",
        "plant": "Tomato",
        "condition": "Wilting",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Tomato wilting can result from insufficient water, waterlogged roots, root injury, high evaporative demand, vascular disease, or other stresses. Check soil moisture at root depth rather than relying only on the surface, review recent irrigation and drainage, and compare affected plants with healthy ones. Note whether wilting occurs during the hottest part of the day, persists overnight, or affects one side or a group of plants. Inspect roots and stems only when this can be done without spreading a suspected disease. Wilting alone cannot identify the cause. Correct management should follow the evidence, and persistent or spreading wilt warrants local diagnostic support."""
    },


    # =================================================
    # 13. CORN
    # =================================================

    {
        "title": "Corn Cultivation Guide",
        "plant": "Corn",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Corn cultivation requires appropriate soil preparation,
establishment, water management, nutrition, light, and
monitoring.

Plants should be observed for growth problems, water stress,
nutrient problems, pests, and disease symptoms.

Management should be adapted to local growing conditions and
the crop production system.
"""
    },

    {
        "title": "Corn Common Rust",
        "plant": "Corn",
        "condition": "Common Rust",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Common rust of corn is typically associated with raised, reddish-brown to cinnamon-colored pustules on leaf surfaces; pustules may occur on both sides of leaves and can release powdery spores. Inspect several leaves and plants, noting the distribution, lesion appearance, and whether symptoms are increasing. Other leaf diseases, insect injury, and environmental damage may look similar, so appearance should be assessed alongside crop stage and local disease information. Record photographs and field conditions where possible. Avoid assuming that every rust-colored mark is common rust. If symptoms are severe or spreading, seek crop-specific local guidance and use only management practices supported for the crop and region."""
    },

    {
        "title": "Corn Northern Leaf Blight",
        "plant": "Corn",
        "condition": "Northern Leaf Blight",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Northern corn leaf blight commonly produces elongated, cigar-shaped gray-green to tan lesions that extend along the leaf. Lesion size and appearance can vary with cultivar, weather, and disease stage, and other leaf diseases may cause similar discoloration. Inspect lower and upper leaves across multiple plants, record the location and progression of lesions, and note recent weather and crop stage. Photographs of representative lesions can support further assessment. Do not confirm the disease from a single lesion alone. If symptoms are increasing or threaten crop performance, consult local agricultural extension guidance for diagnosis and regionally appropriate management."""
    },

    {
        "title": "Corn Gray Leaf Spot",
        "plant": "Corn",
        "condition": "Gray Leaf Spot",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Gray leaf spot of corn often develops as rectangular, tan-to-gray lesions bounded by leaf veins, giving lesions a relatively straight-sided appearance. Symptoms may be more noticeable on older leaves and can progress under favorable humid conditions, but visual overlap with other leaf problems is possible. Inspect multiple plants and leaves, noting lesion shape, location, progression, crop stage, and recent weather. Record photographs and compare changes over time. Do not use color alone to confirm the disease. When symptoms spread or severity is uncertain, seek local crop-diagnostic advice and follow regionally appropriate recommendations rather than applying an unverified treatment."""
    },

    {
        "title": "Corn Leaf Problems",
        "plant": "Corn",
        "condition": "Leaf Problems",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Corn leaf symptoms can result from fungal or bacterial disease, insect feeding, nutrient imbalance, water stress, herbicide injury, or physical damage. Begin by describing the pattern: spots or stripes, lesion shape, affected leaf age, whether symptoms follow veins, and whether damage is uniform or patchy across the field. Check soil moisture, recent weather, fertilizer and herbicide history, and visible pests. Compare affected plants with nearby healthy plants and photograph representative examples. A symptom name is not a diagnosis, and several causes can occur together. Use the combined evidence to guide further testing or seek local agronomic support before choosing corrective action."""
    },


    # =================================================
    # 14. OTHER CROPS
    # =================================================

    {
        "title": "Apple Cultivation Guide",
        "plant": "Apple",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Apple production depends on climate suitability, cultivar and rootstock choice, soil drainage, water availability, pollination needs, canopy management, and regular pest and disease monitoring. Local chill requirements, flowering time, and climate adaptation differ among cultivars, so selection should be based on regional recommendations. Monitor growth from dormancy and flowering through fruit development and harvest, recording unusual leaf, shoot, and fruit symptoms. Maintain suitable soil moisture without prolonged waterlogging and avoid making fertilizer decisions without considering crop condition and available soil information. Pruning, pollination, and plant-protection practices should follow reliable local guidance for the variety and production system."""
    },

    {
        "title": "Apple Scab",
        "plant": "Apple",
        "condition": "Apple Scab",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Apple scab, caused by Venturia inaequalis, can produce olive-green to dark, velvety spots on leaves and fruit. Lesions may become darker or more corky as they develop, and severe leaf infection can contribute to premature leaf drop. Inspect young leaves, fruit, and the canopy, and record whether new symptoms appear after wet periods. Other leaf spots or damage can resemble scab, so confirm the pattern and local disease history before deciding on management. Orchard sanitation and canopy airflow are components of integrated management, but specific control timing depends on local conditions and crop guidance. Seek local advice if the diagnosis is uncertain or symptoms are widespread."""
    },

    {
        "title": "Apple Black Rot",
        "plant": "Apple",
        "condition": "Black Rot",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Apple black rot, commonly associated with the fungus Diplodia seriata, can affect fruit, leaves, and woody tissues. Fruit symptoms may begin as small brown spots that enlarge, sometimes developing concentric rings; cankers or dead branches may also be present. Appearance depends on tissue and disease stage, and other fruit rots or injuries can look similar. Inspect fruit, leaves, and branches together, note whether affected fruit is attached or stored, and record recent weather and sanitation conditions. Remove and handle affected material according to local orchard guidance. Do not diagnose from fruit color alone; consult a local specialist if symptoms are spreading or uncertain."""
    },

    {
        "title": "Apple Cedar Apple Rust",
        "plant": "Apple",
        "condition": "Cedar Apple Rust",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Cedar-apple rust is caused by Gymnosporangium species and involves junipers or red cedars as an alternate host. On apple, symptoms can include yellow-orange spots on leaves and, later, distinctive structures on the undersides; fruit may also be affected. Symptoms and timing vary with local weather and the presence of alternate hosts. Inspect both leaf surfaces and fruit, photograph representative symptoms, and note the time of year and nearby juniper plants. Other leaf spots can resemble rust, so visual clues should be considered together. Management depends on local disease pressure, host proximity, and regional recommendations; seek local guidance when confirmation is needed."""
    },

    {
        "title": "Potato Cultivation Guide",
        "plant": "Potato",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Potato production benefits from healthy, suitable planting material, well-drained soil, appropriate planting depth and spacing, balanced water supply, and crop-stage-aware nutrition. Soil conditions influence root growth, tuber development, and the risk of rots. Avoid prolonged waterlogging and monitor moisture during establishment, canopy growth, and tuber development. Inspect plants for unusual leaf spots, wilting, insect activity, and uneven growth, and record where symptoms occur. Crop variety, season, and local disease pressure affect management decisions. Use locally recommended practices for planting material, earthing-up, harvest maturity, and storage, and avoid applying fertilizer or crop-protection products without crop-specific evidence."""
    },

    {
        "title": "Pepper Cultivation Guide",
        "plant": "Pepper",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Pepper production requires a suitable variety, adequate light, well-drained soil or growing medium, consistent but not excessive moisture, and temperatures appropriate to the crop and production system. Monitor young growth, flowers, and fruit for wilting, discoloration, pest activity, and fruit abnormalities. Irregular watering, root-zone problems, nutrition issues, and diseases can produce overlapping symptoms, so review the whole plant and recent management before acting. Maintain airflow and spacing suited to the growing environment, and record changes over time. Planting dates, spacing, nutrition, and disease-management decisions should follow reliable local guidance for the pepper type and season."""
    },

    {
        "title": "Cucumber Cultivation Guide",
        "plant": "Cucumber",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Cucumber plants grow rapidly and are sensitive to changes in water availability, temperature, root conditions, and growing-medium drainage. Provide a suitable support or ground-growing arrangement, adequate light, and airflow appropriate to the production system. Monitor leaves, stems, flowers, and fruit for wilting, discoloration, powdery growth, spots, and pest activity. Water stress, nutrient issues, and disease may look similar, so check soil moisture and recent conditions before concluding the cause. Avoid prolonged saturation around roots and record symptoms as they develop. Use crop- and region-specific recommendations for spacing, nutrition, pollination, and disease management."""
    },

    {
        "title": "Lettuce Cultivation Guide",
        "plant": "Lettuce",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Lettuce performs best when the variety and growing season suit local conditions and the crop receives appropriate light, moisture, nutrition, and root-zone aeration. Monitor leaf color, texture, growth rate, and signs of wilting, tip damage, pests, or rot. Moisture extremes and unsuitable temperatures can reduce quality, and dense foliage may restrict airflow. Check the growing medium and irrigation history before attributing symptoms to nutrition or disease. Harvest maturity and handling requirements depend on the lettuce type and intended market. Use local crop guidance for sowing time, spacing, irrigation, and variety selection, and record recurring problems to improve future plantings."""
    },

    {
        "title": "Onion Cultivation Guide",
        "plant": "Onion",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Onion production depends on choosing a suitable variety and planting method for the local day length, season, soil, and intended harvest. Well-drained soil and careful water management are important because prolonged wet conditions can damage roots and increase disease risk. Monitor emergence, leaf growth, discoloration, pest activity, and signs of bulb or root problems. The crop's stage and recent irrigation, weather, and soil conditions should be considered together when symptoms appear. Harvest and curing practices affect storage quality and should follow local recommendations for the variety and production system. Avoid using a general fertilizer or irrigation schedule without considering crop needs and field conditions."""
    },

    {
        "title": "Wheat Cultivation Guide",
        "plant": "Wheat",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Wheat management should account for variety, sowing date, local climate, soil condition, seed quality, water availability, and the crop's growth stage. Monitor emergence and stand uniformity, tillering, leaf color, lodging, weeds, pests, and disease symptoms as the crop develops. Water and nutrient requirements change during the season, so decisions should be based on local recommendations and field observations rather than a fixed universal schedule. When leaf symptoms appear, record their distribution and recent weather and management history. Harvest timing and grain handling influence quality. Use region-specific agronomic guidance for sowing rate, nutrition, irrigation, and disease management."""
    },


    # =================================================
    # 15. PLANT ENVIRONMENT
    # =================================================

    {
        "title": "Plant Temperature Management",
        "plant": "General",
        "condition": "Temperature",
        "category": "environment",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Temperature influences germination, growth rate, flowering, fruit set, and stress responses, but suitable ranges differ among crops and growth stages. Interpret temperature readings alongside humidity, light, ventilation, root-zone moisture, and plant appearance. A single sensor reading may not represent conditions across a greenhouse or field, so check sensor placement, calibration, and readings from relevant locations when possible. Record the time and duration of unusual temperatures and compare them with changes in plant condition. Adjust ventilation, shading, or other controls only where appropriate to the crop and system. Use crop-specific local guidance rather than applying one temperature threshold to all plants."""
    },

    {
        "title": "Plant Humidity Management",
        "plant": "General",
        "condition": "Humidity",
        "category": "environment",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Relative humidity affects transpiration and the moisture conditions around leaves. High humidity combined with poor airflow or prolonged leaf wetness can favor some diseases, while low humidity and high temperature may increase water loss. Interpret humidity with air temperature, crop density, ventilation, irrigation, and visible plant condition. Check whether the sensor is positioned near representative foliage and whether readings change across the growing area. Record persistent patterns rather than reacting to a brief fluctuation. Ventilation and irrigation adjustments should suit the crop and local conditions; humidity alone does not identify a disease or determine a universal treatment threshold."""
    },

    {
        "title": "Plant Light Requirements",
        "plant": "General",
        "condition": "Light",
        "category": "environment",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Light supplies the energy plants use for photosynthesis, but the amount and duration needed vary by crop, variety, and growth stage. Insufficient light may contribute to stretched, weak growth and reduced development, while excessive light or heat can cause stress in susceptible plants. Consider light together with temperature, water status, leaf color, and plant spacing. In protected growing systems, check shading, greenhouse orientation, and whether nearby plants block light. If measuring light, use a suitable sensor and compare readings at representative canopy locations and times of day. Make adjustments according to crop-specific guidance rather than assuming all plants need identical light conditions."""
    },

    {
        "title": "Plant Air Circulation",
        "plant": "General",
        "condition": "Air Circulation",
        "category": "environment",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Air circulation helps distribute heat and humidity and can reduce stagnant, persistently moist air around foliage. Its effectiveness depends on greenhouse or field layout, vents, fans where present, plant density, and external weather. Observe whether some areas remain warmer or more humid than others and whether foliage stays wet for long periods. Sensor placement matters: one reading may not represent the whole growing area. Airflow should be adequate for the crop without creating damaging drafts or excessive water loss. Improved circulation supports environmental management but does not replace sanitation, correct irrigation, or disease diagnosis. Follow system- and crop-specific guidance when changing ventilation."""
    },

    {
        "title": "Heat Stress in Plants",
        "plant": "General",
        "condition": "Heat Stress",
        "category": "stress",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Heat stress may cause wilting, leaf rolling, scorch, flower drop, reduced growth, or poor fruit set, depending on the crop and stage. Assess the duration and timing of high temperatures alongside humidity, sunlight, soil moisture, root condition, and ventilation. Check whether symptoms are widespread or concentrated in exposed areas and whether plants recover during cooler periods. Wilting does not prove heat stress because root disease and waterlogging can produce similar signs. Where appropriate, review shade and ventilation options and maintain suitable root-zone moisture without overwatering. Use crop-specific recommendations and seek local advice if damage is severe or symptoms persist."""
    },

    {
        "title": "Cold Stress in Plants",
        "plant": "General",
        "condition": "Cold Stress",
        "category": "stress",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Cold stress can slow growth, discolor leaves, damage tender tissues, and interfere with flowering or fruit development. Sensitivity differs greatly by crop, variety, growth stage, and exposure duration. Record minimum and maximum temperatures where possible, note whether symptoms followed a cold event, and compare affected and sheltered plants. Similar symptoms can result from nutrient issues, root damage, or disease, so inspect the wider context before diagnosing cold injury. Protecting plants, changing ventilation, or adjusting planting dates should follow crop-specific local guidance. If tissue damage is extensive, monitor new growth and seek agronomic advice rather than assuming immediate recovery."""
    },


    # =================================================
    # 16. HARVEST
    # =================================================

    {
        "title": "Crop Harvest Monitoring",
        "plant": "General",
        "condition": "Harvest",
        "category": "harvest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Harvest monitoring involves observing crop maturity,
appearance, size, quality, and other crop-specific indicators.

Harvest timing should be based on the requirements of the
specific crop and intended use.

Regular monitoring helps identify when produce is approaching
the appropriate harvest stage.
"""
    },

    {
        "title": "Post-Harvest Crop Care",
        "plant": "General",
        "condition": "Post-Harvest",
        "category": "harvest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Post-harvest care aims to preserve quality, reduce mechanical injury, and slow deterioration between harvest and use or sale. Handle produce gently, keep containers and handling surfaces clean, remove damaged items when appropriate, and avoid exposing crops to unsuitable temperature or moisture conditions. Different crops have different requirements for curing, cooling, humidity, ventilation, and storage duration, so there is no single storage setting for all produce. Record harvest date, maturity, visible damage, and storage conditions when quality problems occur. Follow reliable crop-specific guidance and food-safety practices, and do not store produce in conditions that encourage condensation or contamination."""
    },


    # =================================================
    # 17. HOME GARDEN / CONTAINERS
    # =================================================

    {
        "title": "Home Garden Plant Care",
        "plant": "General",
        "condition": "Home Garden",
        "category": "home_gardening",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Home gardening requires attention to container or soil
conditions, light, water, drainage, nutrition, and plant
spacing.

Plants in small spaces should be monitored frequently because
environmental conditions can change quickly.

Regular observation helps identify stress, pests, and disease
symptoms early.
"""
    },

    {
        "title": "Container Plant Growing",
        "plant": "General",
        "condition": "Container Growing",
        "category": "home_gardening",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Container-grown plants depend heavily on the quality of the
growing medium, drainage, water management, container size,
light, and nutrition.

Containers can dry out or remain wet differently from open
soil, so regular observation of moisture and plant condition
is important.
"""
    },


    # =================================================
    # 18. SMART AGRICULTURE
    # =================================================

    {
        "title": "Smart Plant Monitoring",
        "plant": "General",
        "condition": "Smart Monitoring",
        "category": "smart_agriculture",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Smart plant monitoring combines sensor measurements,
environmental observations, plant observations, and records.

A monitoring system can help identify changes in temperature,
humidity, soil moisture, light, irrigation conditions, and
plant health.

The purpose of smart monitoring is to support earlier
observation and better decisions. It should not automatically
treat a sensor value as a confirmed diagnosis.
"""
    },

    {
        "title": "Agricultural Decision Making",
        "plant": "General",
        "condition": "Decision Making",
        "category": "smart_agriculture",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Agricultural decisions should consider multiple evidence
sources.

Useful evidence can include plant observations, environmental
measurements, irrigation history, soil condition, pest
observations, disease symptoms, crop stage, and previous
records.

When evidence is incomplete, additional monitoring and
inspection may be preferable to making an unsupported
conclusion.
"""
    },

    {
        "title": "Plant Monitoring Decision Workflow",
        "plant": "General",
        "condition": "Monitoring Decision",
        "category": "smart_agriculture",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
A practical plant monitoring decision workflow can be:

1. Observe the plant.
2. Check current environmental conditions.
3. Review recent measurements and records.
4. Check irrigation and management history.
5. Look for pests or disease symptoms.
6. Compare current observations with previous observations.
7. Identify unusual or persistent changes.
8. Investigate possible causes.
9. Apply only supported management actions.
10. Continue monitoring after the action.

The workflow helps separate observation from diagnosis and
reduces decisions based on a single signal.
"""
    },


    # =================================================
    # 19. GENERAL AGRICULTURAL QUESTIONS
    # =================================================

    {
        "title": "Choosing a Crop",
        "plant": "General",
        "condition": "Crop Selection",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """Crop selection should consider local climate and season, soil or growing medium, water availability and quality, light, growing space, market or household purpose, and the time and skill available for management. Check whether the crop's temperature and day-length requirements fit the location and whether reliable seed or planting material is available. Consider common local pests and diseases and the expected harvest and storage needs. For a greenhouse or container system, also consider ventilation, drainage, and available space. Compare options using local agricultural guidance rather than relying on popularity alone, and begin with a manageable area when experience or conditions are uncertain."""
    },

    {
        "title": "General Agricultural Decision Making",
        "plant": "General",
        "condition": "Agricultural Decision Making",
        "category": "general_agriculture",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Agricultural decisions should be based on the crop,
environment, available observations, and reliable information.

When information is incomplete, additional observation or
expert assessment may be appropriate.

Avoid making major decisions based on a single symptom,
single sensor reading, or unsupported assumption.
"""
    },

]


# =====================================================
# DOCUMENT ACCESS AND VALIDATION
# =====================================================

from collections import Counter

DEFAULT_SOURCE_NAME = "Khadrwy Agricultural Knowledge Base"
REQUIRED_FIELDS = (
    "title", "plant", "condition", "category", "source_type",
    "source_name", "source_url", "year", "content",
)

def normalize_documents():
    """Normalize metadata without changing or deleting knowledge content."""
    for doc in documents:
        for field in REQUIRED_FIELDS:
            doc.setdefault(field, None)
        for field in ("title", "plant", "condition", "category", "source_type",
                      "source_name", "source_url", "content"):
            value = doc.get(field)
            if isinstance(value, str):
                doc[field] = value.strip()
        if not doc.get("source_name"):
            doc["source_name"] = DEFAULT_SOURCE_NAME
        if not doc.get("source_url"):
            doc["source_url"] = ""
        if doc.get("year") in ("", 0):
            doc["year"] = None
    return documents

def get_documents():
    """Return normalized agricultural knowledge documents for the RAG pipeline."""
    return normalize_documents()

def validate_knowledge_base():
    """Print a basic quality report; this function does not delete documents."""
    normalize_documents()
    issues = []
    title_counts = Counter()
    categories = Counter()
    plants = Counter()
    source_types = Counter()
    for i, doc in enumerate(documents, start=1):
        label = doc.get("title") or f"Document #{i}"
        for field in REQUIRED_FIELDS:
            if field not in doc:
                issues.append(f"{label}: missing field '{field}'")
        for field in ("title", "category", "content"):
            if not doc.get(field):
                issues.append(f"{label}: empty '{field}'")
        if len((doc.get("content") or "").split()) < 40:
            issues.append(f"{label}: short content ({len((doc.get('content') or '').split())} words)")
        title_counts[(doc.get("title") or "").casefold()] += 1
        categories[doc.get("category") or "Uncategorized"] += 1
        plants[doc.get("plant") or "General"] += 1
        source_types[doc.get("source_type") or "Unspecified"] += 1
        url = doc.get("source_url") or ""
        if url and not url.startswith(("https://", "http://")):
            issues.append(f"{label}: invalid source URL")
    duplicates = sorted(title for title, count in title_counts.items() if title and count > 1)
    print("\n" + "=" * 55)
    print("KHADRWY KNOWLEDGE BASE AUDIT")
    print("=" * 55)
    print(f"Total documents: {len(documents)}")
    for label, counts in (("Categories", categories), ("Plants", plants), ("Source types", source_types)):
        print(f"\nDocuments by {label.lower()}:")
        for name, count in sorted(counts.items()):
            print(f"  {name}: {count}")
    print("\nDuplicate titles:")
    print("\n".join(f"  - {title}" for title in duplicates) if duplicates else "  None")
    print("\nIssues:")
    print("\n".join(f"  - {issue}" for issue in issues) if issues else "  No basic validation issues found.")
    print("=" * 55)
    return {"total_documents": len(documents), "duplicates": duplicates, "issues": issues,
            "categories": dict(categories), "plants": dict(plants), "source_types": dict(source_types)}

if __name__ == "__main__":
    validate_knowledge_base()